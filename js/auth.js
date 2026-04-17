// auth.js — Supabase Auth helper (共用 ChouLegal 帳號系統)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
  auth: { flowType: 'implicit' }
});

export async function getUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('getUser failed:', err);
    return null;
  }
}

export async function getProfile() {
  try {
    const user = await getUser();
    if (!user) return null;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return data || null;
  } catch (err) {
    console.error('getProfile failed:', err);
    return null;
  }
}

export async function signInWithApple() {
  try {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: window.location.origin + '/account.html' }
    });
  } catch (err) {
    console.error('signInWithApple failed:', err);
    return err;
  }
}

export async function signInWithEmail(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/account.html' }
    });
    return error;
  } catch (err) {
    console.error('signInWithEmail failed:', err);
    return err;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    window.location.reload();
  } catch (err) {
    console.error('signOut failed:', err);
  }
}
