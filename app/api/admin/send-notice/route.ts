export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const token = (cookies() as any).get('auth_token')?.value;
  if (token !== 'admin-logged-in') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { username, notice } = await request.json();
  const { error } = await supabase
    .from('tax_notices')
    .insert([{ username, notice }]);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}