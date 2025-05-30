export const runtime = 'edge';
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  // remove both cookies by name only
  res.cookies.delete('auth_token');
  res.cookies.delete('username');
  return res;
}