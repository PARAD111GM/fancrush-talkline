-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  available_minutes INTEGER DEFAULT 0,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT
);

-- Create influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  profile_image_url TEXT,
  landing_page_image_urls TEXT[],
  greeting_copy TEXT,
  vapi_assistant_id TEXT
);

-- Create call_logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  influencer_id UUID REFERENCES influencers(id) ON DELETE SET NULL,
  call_type TEXT CHECK (call_type IN ('web_demo', 'pstn')),
  platform_call_sid TEXT,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  minutes_deducted INTEGER,
  status TEXT CHECK (status IN ('initiated', 'answered', 'completed', 'failed', 'busy', 'no-answer'))
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_charge_id TEXT UNIQUE,
  amount_paid_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  minutes_purchased INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) policies

-- Profiles: Users can read their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Influencers: Public read-only
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Influencers are viewable by everyone"
  ON influencers FOR SELECT
  USING (true);

-- Call Logs: Users can only view their own call logs
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own call logs"
  ON call_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Transactions: Users can only view their own transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id); 