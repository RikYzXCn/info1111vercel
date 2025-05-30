export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase }     from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomNumber = searchParams.get('roomNumber');

  let query = supabase.from('renovation_requests').select('*');
  if (roomNumber) {
    query = query.eq('room_number', roomNumber);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[query-renovation] Supabase error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}