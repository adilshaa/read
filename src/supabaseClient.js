import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://cbgzmudjatphryoohlfh.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZ3ptdWRqYXRwaHJ5b29obGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzE1OTYsImV4cCI6MjA1NTAwNzU5Nn0.AY-YD-JugqF3_rYhufGIrvKLb735MNjfDcrQG1Js6b4";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
