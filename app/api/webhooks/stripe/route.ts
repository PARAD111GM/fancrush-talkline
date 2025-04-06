import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Webhook endpoint
export async function POST(request: Request) {
  try {
    // Get the raw request body as text
    const body = await request.text();
    
    // Get the Stripe signature from headers
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body, 
        signature, 
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createServerSupabaseClient();
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract user ID and minutes from metadata
      const userId = session.metadata?.user_id;
      const minutesPurchased = session.metadata?.minutes;
      
      if (!userId || !minutesPurchased) {
        return NextResponse.json({ error: 'Missing user metadata in session' }, { status: 400 });
      }

      try {
        // Get the user's current available minutes
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('available_minutes')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Error fetching user profile:', userError);
          return NextResponse.json({ error: 'Error fetching user profile' }, { status: 500 });
        }
        
        // Calculate the new minutes total
        const currentMinutes = userData.available_minutes || 0;
        const newMinutes = currentMinutes + parseInt(minutesPurchased, 10);
        
        // Update the user's available minutes
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ available_minutes: newMinutes })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating user minutes:', updateError);
          return NextResponse.json({ error: 'Error updating user minutes' }, { status: 500 });
        }
        
        // Record the transaction
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents to dollars
            type: 'purchase',
            description: `Purchased ${minutesPurchased} minutes`,
          });
          
        if (transactionError) {
          console.error('Error recording transaction:', transactionError);
          // Don't return error here, as minutes are already added
        }
        
        console.log(`Successfully added ${minutesPurchased} minutes to user ${userId}`);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
      }
    }
    
    // Return a 200 response for unhandled events
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 