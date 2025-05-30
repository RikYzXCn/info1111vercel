export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';


export async function POST(request: Request) {
  const { username, password } = await request.json();

  // 1) Fetch the user record
  const { data, error } = await supabase
    .from('users')
    .select('password, is_admin')
    .eq('username', username)
    .single();

  if (error) {
    // e.g. user not found
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // 2) Compare passwords (in prod you’d hash+compare)
  if (data.password !== password) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // 3) Success: set the auth_token cookie
  // Choose token based on is_admin
  const tokenValue = data.is_admin ? 'admin-logged-in' : 'user-logged-in';
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: 'auth_token',
    value: tokenValue,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  // also set username for other pages
  res.cookies.set({
    name: 'username',
    value: username,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
