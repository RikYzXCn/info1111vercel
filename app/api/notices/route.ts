export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase }    from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('notices')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}