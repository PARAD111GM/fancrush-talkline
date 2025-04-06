'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [callInitiating, setCallInitiating] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated and redirect if not
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      // Load user profile if authenticated
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setProfile(profile);
      setLoading(false);
    };
    
    checkAuth();
  }, [supabase, router]);

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
      
      {/* Minutes Balance */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Minutes</CardTitle>
            <CardDescription>Your current talk time balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{profile?.available_minutes || 0}</p>
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
                    disabled={callInitiating}
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
                    disabled={callInitiating}
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
                    disabled={callInitiating}
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
      
      {/* Account Actions */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
} 