export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { cookies }      from 'next/headers'


export async function GET() {
  const cookieStore = cookies() as any
  const token        = cookieStore.get('auth_token')?.value
  const username     = cookieStore.get('username')?.value || null

  // recognize both user & admin tokens
  const loggedIn = token === 'user-logged-in' || token === 'admin-logged-in'

  return NextResponse.json({ loggedIn, username })
}