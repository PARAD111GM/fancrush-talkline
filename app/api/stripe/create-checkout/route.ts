import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Create a checkout session for purchasing minutes
export async function POST(request: Request) {
  try {
    // Parse request body
    const { minutes, priceCents, successUrl, cancelUrl } = await request.json();
    
    // Validate inputs
    if (!minutes || typeof minutes !== 'number' || minutes <= 0) {
      return NextResponse.json({ error: 'Invalid minutes value' }, { status: 400 });
    }
    
    if (!priceCents || typeof priceCents !== 'number' || priceCents <= 0) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
    }

    // Create Supabase server client
    const supabase = createServerSupabaseClient();
    
    // Get the user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user profile to check for existing stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    // Create or retrieve a Stripe customer
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          user_id: session.user.id
        }
      });
      
      customerId = customer.id;
      
      // Update the user's profile with the new Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }

    // Create the checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${minutes} Talk Time Minutes`,
              description: `Purchase of ${minutes} minutes for Fancrush Talkline`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?success=true`,
      cancel_url: `${cancelUrl}?canceled=true`,
      metadata: {
        user_id: session.user.id,
        minutes: minutes.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 