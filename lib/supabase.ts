import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Auto-correct if the user entered only their Supabase reference ID (e.g. 20 characters)
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  const trimmed = supabaseUrl.trim();
  if (trimmed.length === 20) {
    supabaseUrl = `https://${trimmed}.supabase.co`;
  } else {
    supabaseUrl = 'https://placeholder-url.supabase.co';
  }
}

// On the server side (like in server actions), use the service role key if configured
// to bypass RLS policies for admin mutations, while keeping client calls bound by RLS.
const isServer = typeof window === 'undefined';
const supabaseKey = (isServer && process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? process.env.SUPABASE_SERVICE_ROLE_KEY 
  : supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
