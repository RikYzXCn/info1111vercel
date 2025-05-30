export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { roomNumber, company, phone, schedule } = await request.json();

    // Insert request into Supabase and return inserted row
    const { data, error } = await supabase
      .from('renovation_requests')
      .insert([
        { room_number: roomNumber, company, phone, schedule }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'No record returned' }, { status: 500 });
    }

    return NextResponse.json({ success: true, record: data[0] });
  } catch (e: any) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ success: false, error: e.message || 'Unknown error' }, { status: 500 });
  }
}