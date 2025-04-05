import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type CookieOptions } from '@supabase/ssr';

// Define database types based on our schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          available_minutes: number;
          phone_number: string | null;
          phone_verified: boolean;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          available_minutes?: number;
          phone_number?: string | null;
          phone_verified?: boolean;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          available_minutes?: number;
          phone_number?: string | null;
          phone_verified?: boolean;
          stripe_customer_id?: string | null;
        };
      };
      influencers: {
        Row: {
          id: string;
          created_at: string | null;
          name: string;
          slug: string;
          profile_image_url: string | null;
          landing_page_image_urls: string[] | null;
          greeting_copy: string | null;
          vapi_assistant_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          name: string;
          slug: string;
          profile_image_url?: string | null;
          landing_page_image_urls?: string[] | null;
          greeting_copy?: string | null;
          vapi_assistant_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          name?: string;
          slug?: string;
          profile_image_url?: string | null;
          landing_page_image_urls?: string[] | null;
          greeting_copy?: string | null;
          vapi_assistant_id?: string | null;
        };
      };
      call_logs: {
        Row: {
          id: string;
          user_id: string | null;
          influencer_id: string | null;
          call_type: 'web_demo' | 'pstn';
          platform_call_sid: string | null;
          start_time: string | null;
          end_time: string | null;
          duration_seconds: number | null;
          minutes_deducted: number | null;
          status: 'initiated' | 'answered' | 'completed' | 'failed' | 'busy' | 'no-answer';
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          influencer_id?: string | null;
          call_type: 'web_demo' | 'pstn';
          platform_call_sid?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          duration_seconds?: number | null;
          minutes_deducted?: number | null;
          status: 'initiated' | 'answered' | 'completed' | 'failed' | 'busy' | 'no-answer';
        };
        Update: {
          id?: string;
          user_id?: string | null;
          influencer_id?: string | null;
          call_type?: 'web_demo' | 'pstn';
          platform_call_sid?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          duration_seconds?: number | null;
          minutes_deducted?: number | null;
          status?: 'initiated' | 'answered' | 'completed' | 'failed' | 'busy' | 'no-answer';
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_charge_id: string | null;
          amount_paid_cents: number;
          currency: string;
          minutes_purchased: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_charge_id?: string | null;
          amount_paid_cents: number;
          currency: string;
          minutes_purchased: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          stripe_charge_id?: string | null;
          amount_paid_cents?: number;
          currency?: string;
          minutes_purchased?: number;
          created_at?: string | null;
        };
      };
    };
  };
};

// Create a Supabase client for use in the browser
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Create a Supabase client for use in server components/API routes
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}; 