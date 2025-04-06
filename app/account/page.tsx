'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [callInitiating, setCallInitiating] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  
  // Phone verification
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  
  // Call history
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [loadingCallHistory, setLoadingCallHistory] = useState(false);
  
  // Load user's call history
  const loadCallHistory = useCallback(async (userId: string) => {
    setLoadingCallHistory(true);
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select(`
          *,
          influencers:influencer_id (name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error loading call history:', error);
      } else {
        setCallHistory(data || []);
      }
    } catch (err) {
      console.error('Error loading call history:', err);
    } finally {
      setLoadingCallHistory(false);
    }
  }, [supabase]);
  
  useEffect(() => {
    // Check if user is authenticated and redirect if not
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/account');
        return;
      }
      
      // Load user profile if authenticated
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setProfile(profile);
      if (profile?.phone_number) {
        setPhoneNumber(profile.phone_number);
      }
      
      // Load call history
      loadCallHistory(session.user.id);
      
      setLoading(false);
    };
    
    checkAuth();
  }, [supabase, router, loadCallHistory]);
  
  // Format duration in seconds to minutes and seconds
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleBuyMinutes = async (minutes: number, priceCents: number) => {
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minutes,
          priceCents,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleInitiateCall = async (influencerId: string) => {
    // Check if phone is verified
    if (!profile?.phone_verified) {
      setCallStatus('You need to verify your phone number before making calls.');
      return;
    }
    
    setCallInitiating(true);
    setCallStatus('Initiating call...');
    
    try {
      const response = await fetch('/api/calls/initiate-pstn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencerId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }
      
      setCallStatus('Call initiated! Your phone will ring shortly.');
      
      // Reset status after 10 seconds
      setTimeout(() => {
        setCallStatus(null);
        setCallInitiating(false);
      }, 10000);
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallStatus('Failed to initiate call. Please try again.');
      setCallInitiating(false);
    }
  };

  const handleSendVerificationCode = async () => {
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      setVerificationMessage('Please enter a valid phone number in international format (e.g., +19876543210)');
      return;
    }

    setLoading(true);
    setVerificationMessage('Sending verification code...');

    try {
      // Here in a real app, you would call an API to send a verification code
      // For this demo, we'll simulate the process
      
      // Update the phone number in the profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          phone_number: phoneNumber,
          phone_verified: false
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setShowVerificationInput(true);
      setVerificationMessage('Verification code sent! Please enter it below.');
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      setVerificationMessage(`Error: ${error.message || 'Failed to send verification code'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      setVerificationMessage('Please enter a valid verification code');
      return;
    }

    setLoading(true);
    setVerificationMessage('Verifying...');

    try {
      // In a real app, you would verify the code with your API
      // For this demo, we'll simply accept any 6-digit code
      
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        // Update the profile to mark the phone as verified
        const { error } = await supabase
          .from('profiles')
          .update({ 
            phone_verified: true 
          })
          .eq('id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setProfile({
          ...profile,
          phone_number: phoneNumber,
          phone_verified: true
        });
        
        setShowVerificationInput(false);
        setVerificationMessage('Phone number verified successfully!');
        
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setVerificationMessage(null);
        }, 3000);
      } else {
        setVerificationMessage('Invalid verification code. Please try again.');
      }
    } catch (error: any) {
      console.error('Error verifying phone:', error);
      setVerificationMessage(`Error: ${error.message || 'Failed to verify phone'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-16 min-h-[60vh]">
        <p>Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Account</h1>
      
      {/* Phone Verification */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Phone Verification</CardTitle>
            <CardDescription>
              {profile?.phone_verified 
                ? 'Your phone number is verified' 
                : 'Verify your phone number to make calls'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationMessage && (
              <div className={`p-3 rounded-md ${
                verificationMessage.includes('Error') 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-primary/10 text-primary'
              }`}>
                {verificationMessage}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+19876543210"
                disabled={profile?.phone_verified || loading}
                className="flex-1"
              />
              {!profile?.phone_verified && (
                <Button 
                  onClick={handleSendVerificationCode}
                  disabled={loading || !phoneNumber}
                >
                  Send Code
                </Button>
              )}
            </div>
            
            {showVerificationInput && !profile?.phone_verified && (
              <div className="flex space-x-2 mt-2">
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="flex-1"
                />
                <Button 
                  onClick={handleVerifyPhone}
                  disabled={loading || !verificationCode}
                >
                  Verify
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Minutes Balance */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Minutes</CardTitle>
            <CardDescription>Your current talk time balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{profile?.available_minutes || 0}</p>
            <div className="mt-2">
              <Link href="/account/transactions" className="text-sm text-primary hover:underline">
                View transaction history
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Purchase Minutes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Buy Minutes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>10 Minutes</CardTitle>
              <CardDescription>Basic Pack</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">$9.99</p>
              <p className="text-muted-foreground">Perfect for a short conversation</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleBuyMinutes(10, 999)}
                disabled={callInitiating}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>30 Minutes</CardTitle>
              <CardDescription>Popular Choice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">$24.99</p>
              <p className="text-muted-foreground">Our most popular package</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleBuyMinutes(30, 2499)}
                disabled={callInitiating}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>60 Minutes</CardTitle>
              <CardDescription>Best Value</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-2">$44.99</p>
              <p className="text-muted-foreground">The best value for superfans</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleBuyMinutes(60, 4499)}
                disabled={callInitiating}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Start a Call */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Start a Call</h2>
        {profile?.available_minutes > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Emma Johnson</CardTitle>
                  <CardDescription>Travel & Lifestyle</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleInitiateCall('00000000-0000-0000-0000-000000000001')}
                    disabled={callInitiating || !profile?.phone_verified}
                  >
                    Call Me Now
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Jake Smith</CardTitle>
                  <CardDescription>Tech & Gaming</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleInitiateCall('00000000-0000-0000-0000-000000000002')}
                    disabled={callInitiating || !profile?.phone_verified}
                  >
                    Call Me Now
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sophia Chen</CardTitle>
                  <CardDescription>Fitness & Nutrition</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleInitiateCall('00000000-0000-0000-0000-000000000003')}
                    disabled={callInitiating || !profile?.phone_verified}
                  >
                    Call Me Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {callStatus && (
              <div className={`mt-4 p-4 rounded-md ${callStatus.includes('Failed') ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                {callStatus}
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p>You need to purchase minutes before you can start a call.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Call History */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Call History</CardTitle>
            <CardDescription>Your recent calls with influencers</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCallHistory ? (
              <p>Loading call history...</p>
            ) : callHistory.length > 0 ? (
              <div className="space-y-4">
                {callHistory.map((call) => (
                  <div key={call.id} className="flex flex-col sm:flex-row justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{call.influencers?.name || 'Unknown Influencer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(call.created_at)}
                      </p>
                    </div>
                    <div className="sm:text-right mt-2 sm:mt-0">
                      <p className="text-sm capitalize">
                        Status: <span className={`font-medium ${
                          call.status === 'completed' ? 'text-green-500' :
                          call.status === 'failed' ? 'text-red-500' :
                          'text-yellow-500'
                        }`}>{call.status}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(call.duration_seconds)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No call history yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Account Actions */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
} 