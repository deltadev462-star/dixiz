// src/api/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://anfpfnlnvsjvtjjxiedk.supabase.co';
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZnBmbmxudnNqdnRqanhpZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDIzODIsImV4cCI6MjA4MTU3ODM4Mn0.-eN88Jwqu7GcIruF-sJvo4Gz14UvqdeoL-r_Hqdvm3M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'wimed-auth',
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
});

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchAdminProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (error) return null;
  return data;
}

export function isAdmin(profile) {
  return Boolean(profile?.is_admin);
}