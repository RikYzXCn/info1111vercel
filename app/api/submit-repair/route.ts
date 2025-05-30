export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase }   from '@/lib/supabaseClient';

export async function POST(request: Request) {
  // 1. parse either JSON or form-urlencoded
  let body: any = {};
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    body = await request.json();
  } else {
    const form = await request.formData();
    body = {
      roomNumber: form.get('roomNumber')?.toString() || '',
      company:    form.get('company')?.toString()    || '',
      phone:      form.get('phone')?.toString()      || '',
      schedule:   form.get('schedule')?.toString()   || ''
    };
  }

  // 2. insert into Supabase
  const { data, error } = await supabase
    .from('renovation_requests')
    .insert([{
      room_number: body.roomNumber,
      company:     body.company,
      phone:       body.phone,
      schedule:    body.schedule
    }])
    .select(); // ask for the inserted row back

  if (error) {
    console.error('[submit-renovation] Supabase error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ success: false, error: 'No record returned' }, { status: 500 });
  }

  // 3. return the newly created record
  return NextResponse.json({ success: true, record: data[0] });
}