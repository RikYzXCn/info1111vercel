export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { name, license, phone } = await request.json();

  // Insert and select the inserted row
  const { data, error } = await supabase
    .from('parking_applications')
    .insert([{ name, license_plate: license, phone }])
    .select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ success: false, error: 'No record returned' }, { status: 500 });
  }

  // Return the first inserted record
  return NextResponse.json({ success: true, record: data[0] });
}
