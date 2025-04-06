import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with latest API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Webhook endpoint
export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') || '';
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }
  
  let event: Stripe.Event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
  
  // Get Supabase client
  const supabase = await createServerSupabaseClient();
  
  // Handle specific events
  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    
    // Process successful checkout
    if (checkoutSession.status === 'complete' && checkoutSession.payment_status === 'paid') {
      const userId = checkoutSession.metadata?.user_id;
      const minutes = parseInt(checkoutSession.metadata?.minutes || '0', 10);
      
      if (!userId || !minutes) {
        console.error('Missing metadata in checkout session:', checkoutSession.id);
        return NextResponse.json(
          { error: 'Missing session metadata' },
          { status: 400 }
        );
      }
      
      // Begin transaction to update user minutes and create transaction record
      try {
        // 1. Get current available minutes
        const { data: profile } = await supabase
          .from('profiles')
          .select('available_minutes')
          .eq('id', userId)
          .single();
        
        if (!profile) {
          throw new Error(`User profile not found: ${userId}`);
        }
        
        const currentMinutes = profile.available_minutes || 0;
        const newMinutes = currentMinutes + minutes;
        
        // 2. Update user's available minutes
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ available_minutes: newMinutes })
          .eq('id', userId);
        
        if (updateError) {
          throw new Error(`Failed to update minutes: ${updateError.message}`);
        }
        
        // 3. Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            amount: minutes,
            type: 'purchase',
            description: `Purchased ${minutes} minutes`,
            stripe_payment_id: checkoutSession.id
          });
        
        if (transactionError) {
          throw new Error(`Failed to create transaction: ${transactionError.message}`);
        }
        
        console.log(`Successfully processed payment and added ${minutes} minutes for user ${userId}`);
      } catch (error: any) {
        console.error('Error processing payment:', error.message);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
    }
  }
  
  return NextResponse.json({ received: true });
} 