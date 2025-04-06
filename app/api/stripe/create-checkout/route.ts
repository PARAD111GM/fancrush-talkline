import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get request body
    const { minutes, priceCents } = await request.json();
    
    // Validate input
    if (!minutes || !priceCents || isNaN(minutes) || isNaN(priceCents)) {
      return NextResponse.json(
        { error: 'Invalid minutes or price' },
        { status: 400 }
      );
    }
    
    // Get the user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .eq('id', session.user.id)
      .single();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id;
    
    if (!customerId) {
      // Get user email from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user?.email || undefined,
        metadata: {
          supabase_id: session.user.id,
        },
      });
      
      customerId = customer.id;
      
      // Update profile with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }
    
    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${minutes} Minutes Talk Time`,
              description: `Purchase ${minutes} minutes of talk time with influencers`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?checkout=canceled`,
      metadata: {
        user_id: session.user.id,
        minutes: minutes.toString(),
      },
    });
    
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 