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

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
