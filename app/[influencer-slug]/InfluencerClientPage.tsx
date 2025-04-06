'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/supabase-provider';

interface InfluencerClientPageProps {
  influencerId: string;
  influencerName: string;
  voiceId: string;
}

// This component will be enhanced with Vapi Web SDK integration
export default function InfluencerClientPage({ influencerId, influencerName, voiceId }: InfluencerClientPageProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
  }, [supabase.auth]);

  // Handle call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallTime(prev => {
          // Auto-end call after 2 minutes (120 seconds)
          if (prev >= 120) {
            setIsCallActive(false);
            setShowSignupModal(true);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start demo call - in a real implementation, this would initialize Vapi
  const startDemoCall = () => {
    // Here we would integrate with Vapi SDK using:
    // const vapi = new VapiWebChat({ publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY });
    // vapi.start(voiceId);
    
    setIsCallActive(true);
    setCallTime(0);
  };

  // End demo call
  const endDemoCall = () => {
    // Here we would end the Vapi call:
    // vapi.stop();
    
    setIsCallActive(false);
    setShowSignupModal(true);
  };

  // Redirect to login or signup
  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleSignupRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="space-y-4">
      {isCallActive ? (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">On call with {influencerName}</p>
              <p className="text-sm text-muted-foreground">Demo call: {formatTime(callTime)} / 02:00</p>
            </div>
            <Button variant="destructive" onClick={endDemoCall}>End Call</Button>
          </div>
          <div className="p-4 bg-primary/10 text-primary rounded-lg text-sm">
            <p>Just say hello to start your conversation!</p>
          </div>
        </div>
      ) : (
        <Button 
          size="lg" 
          className="w-full h-16 text-lg"
          onClick={startDemoCall}
        >
          Talk Now (2 min free demo)
        </Button>
      )}
      
      {!isCallActive && !isAuthenticated && (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleLoginRedirect}
          >
            Log in
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={handleSignupRedirect}
          >
            Sign up
          </Button>
        </div>
      )}
      
      {/* Post-call signup modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Want to keep talking?</DialogTitle>
            <DialogDescription>
              Your 2-minute demo call with {influencerName} has ended. Sign up to purchase minutes and continue the conversation on your phone!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={handleLoginRedirect}>
              Log in
            </Button>
            <Button className="sm:flex-1" onClick={handleSignupRedirect}>
              Sign up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 