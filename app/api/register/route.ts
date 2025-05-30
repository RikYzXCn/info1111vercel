export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
export async function POST(request: Request) {
  const { username, password } = await request.json();

  const { data: existing, error: selErr } = await supabase
    .from('users')
    .select('id')
    .eq('username', username);
  if (selErr) return NextResponse.json({ success: false, message: selErr.message }, { status: 500 });
  if (existing && existing.length) {
    return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
  }

  const { data, error: insErr } = await supabase
    .from('users')
    .insert([{ username, password, is_admin: false }])
    .select();
  if (insErr) return NextResponse.json({ success: false, message: insErr.message }, { status: 500 });

 // Set cookies
  const response = NextResponse.json({ success: true, user: data![0] });
  response.cookies.set({ name: 'auth_token', value: 'logged-in', httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
  response.cookies.set({ name: 'username', value: username, path: '/', maxAge: 60 * 60 * 24 * 7 });
  return response;
}