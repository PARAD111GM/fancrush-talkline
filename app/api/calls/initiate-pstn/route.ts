import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth';
import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
    const { influencerId } = await request.json();
    
    // Validate input
    if (!influencerId) {
      return NextResponse.json(
        { error: 'Influencer ID is required' },
        { status: 400 }
      );
    }
    
    // Get the user profile to check minutes and phone
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, phone_number, phone_verified, available_minutes')
      .eq('id', session.user.id)
      .single();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    // Validate phone number and minutes
    if (!profile.phone_number || !profile.phone_verified) {
      return NextResponse.json(
        { error: 'Verified phone number required' },
        { status: 400 }
      );
    }
    
    if (!profile.available_minutes || profile.available_minutes <= 0) {
      return NextResponse.json(
        { error: 'No available minutes' },
        { status: 400 }
      );
    }
    
    // Get the influencer details
    const { data: influencer } = await supabase
      .from('influencers')
      .select('id, name, vapi_assistant_id')
      .eq('id', influencerId)
      .single();
    
    if (!influencer || !influencer.vapi_assistant_id) {
      return NextResponse.json(
        { error: 'Influencer not found or not configured for calls' },
        { status: 404 }
      );
    }
    
    // Create a new call record in the database
    const { data: callRecord, error: callError } = await supabase
      .from('call_logs')
      .insert({
        user_id: session.user.id,
        influencer_id: influencerId,
        call_type: 'pstn',
        status: 'initiated',
      })
      .select()
      .single();
    
    if (callError || !callRecord) {
      return NextResponse.json(
        { error: 'Failed to create call record' },
        { status: 500 }
      );
    }
    
    // In a real implementation, we would initiate a Twilio call here
    // This is a simplified version that would connect the user's phone with Vapi
    /*
    const call = await twilioClient.calls.create({
      url: `https://api.vapi.ai/call/phone/${influencer.vapi_assistant_id}`,
      to: profile.phone_number,
      from: process.env.TWILIO_PHONE_NUMBER,
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/calls/status-callback?call_id=${callRecord.id}`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });
    
    // Update the call record with the Twilio SID
    await supabase
      .from('call_logs')
      .update({
        platform_call_sid: call.sid,
        status: 'ringing',
      })
      .eq('id', callRecord.id);
    */
    
    // For demo purposes, since we're not actually making a call
    await supabase
      .from('call_logs')
      .update({
        platform_call_sid: `demo_${Date.now()}`,
        status: 'ringing',
      })
      .eq('id', callRecord.id);
    
    return NextResponse.json({
      success: true,
      message: 'Call initiated',
      call_id: callRecord.id,
    });
  } catch (error: any) {
    console.error('Error initiating call:', error);
    
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 