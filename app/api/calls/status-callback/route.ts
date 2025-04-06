import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth';

// This endpoint handles callbacks from Twilio about call status changes
export async function POST(request: Request) {
  try {
    // Parse the form data from Twilio (Twilio sends form data, not JSON)
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const callDuration = formData.get('CallDuration') ? parseInt(formData.get('CallDuration') as string) : 0;
    const callIdParam = new URL(request.url).searchParams.get('call_id');
    
    if (!callIdParam) {
      return NextResponse.json(
        { error: 'Missing call_id parameter' },
        { status: 400 }
      );
    }
    
    const callId = callIdParam;
    
    // Validate required parameters
    if (!callSid || !callStatus) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Connect to Supabase
    const supabase = createServerSupabaseClient();
    
    // Find the call record in the database
    const { data: callRecord, error: fetchError } = await supabase
      .from('call_logs')
      .select('*')
      .eq('id', callId as string)
      .single();
    
    if (fetchError || !callRecord) {
      console.error('Error fetching call record:', fetchError);
      return NextResponse.json(
        { error: 'Call record not found' },
        { status: 404 }
      );
    }
    
    // Calculate end time and duration (if provided)
    const endTime = callStatus.toLowerCase() === 'completed' ? new Date().toISOString() : null;
    
    // Update the call status in the database
    const { error: updateError } = await supabase
      .from('call_logs')
      .update({
        status: callStatus.toLowerCase(),
        duration_seconds: callDuration > 0 ? callDuration : null,
        end_time: endTime,
        platform_call_sid: callSid
      })
      .eq('id', callId);
    
    if (updateError) {
      console.error('Error updating call status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update call status' },
        { status: 500 }
      );
    }
    
    // If call is completed, update the user's minutes
    if (['completed', 'busy', 'failed', 'no-answer', 'canceled'].includes(callStatus.toLowerCase()) && callDuration > 0) {
      // Calculate minutes used (rounded up to nearest minute)
      const minutesUsed = Math.ceil(callDuration / 60);
      
      // Get the user's current minutes
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('available_minutes')
        .eq('id', callRecord.user_id as string)
        .single();
      
      if (!profileError && profile) {
        // Update the minutes deducted in the call log
        await supabase
          .from('call_logs')
          .update({ 
            minutes_deducted: minutesUsed 
          })
          .eq('id', callId);
          
        // Deduct the final minutes (based on actual call duration)
        // subtracting the initial 1 minute already deducted when initiating the call
        const additionalMinutesToDeduct = Math.max(0, minutesUsed - 1);
        
        if (additionalMinutesToDeduct > 0) {
          const newMinutes = Math.max(0, profile.available_minutes - additionalMinutesToDeduct);
          
          await supabase
            .from('profiles')
            .update({ available_minutes: newMinutes })
            .eq('id', callRecord.user_id as string);
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing call status callback:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 