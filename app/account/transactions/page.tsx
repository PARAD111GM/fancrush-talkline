'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TransactionsPage() {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);

  // Load user's transactions
  const loadTransactions = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading transactions:', error);
      } else {
        setTransactions(data || []);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);
  
  // Load user's call logs with minute deductions
  const loadCallLogs = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select(`
          *,
          influencers:influencer_id (name)
        `)
        .eq('user_id', userId)
        .not('minutes_deducted', 'is', null)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading call logs:', error);
      } else {
        setCallLogs(data || []);
      }
    } catch (err) {
      console.error('Error loading call logs:', err);
    }
  }, [supabase]);

  useEffect(() => {
    // Check if user is authenticated and redirect if not
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/account/transactions');
        return;
      }
      
      // Load transactions
      loadTransactions(session.user.id);
      loadCallLogs(session.user.id);
    };
    
    checkAuth();
  }, [supabase, router, loadTransactions, loadCallLogs]);
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>
      
      {/* Purchases */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Minute Purchases</CardTitle>
            <CardDescription>Your history of minute purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading transaction history...</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col sm:flex-row justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{transaction.minutes_purchased} Minutes</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    <div className="sm:text-right mt-2 sm:mt-0">
                      <p className="font-medium">
                        {formatCurrency(transaction.amount_paid_cents / 100, transaction.currency)}
                      </p>
                      {transaction.stripe_charge_id && (
                        <p className="text-xs text-muted-foreground">
                          ID: {transaction.stripe_charge_id.substring(0, 14)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No purchase history yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Minute Usage */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Minute Usage</CardTitle>
            <CardDescription>Your history of minute deductions from calls</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading call history...</p>
            ) : callLogs.length > 0 ? (
              <div className="space-y-4">
                {callLogs.map((call) => (
                  <div key={call.id} className="flex flex-col sm:flex-row justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{call.influencers?.name || 'Unknown Influencer'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(call.created_at)}
                      </p>
                    </div>
                    <div className="sm:text-right mt-2 sm:mt-0">
                      <p className="font-medium text-destructive">
                        -{call.minutes_deducted} {call.minutes_deducted === 1 ? 'Minute' : 'Minutes'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Call duration: {Math.floor(call.duration_seconds / 60)}:{(call.duration_seconds % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No minute usage history yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 