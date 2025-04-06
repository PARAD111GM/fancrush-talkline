import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase-types';

/**
 * Creates a Supabase client for use in Server Components and API routes.
 * This is a simpler implementation that doesn't use cookies.
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or anonymous key');
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseKey
  );
} 