import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SendNoticeClient from './SendNoticeClient'  // regular import

export const runtime = 'edge'

export default function SendNoticePage() {
  const token = (cookies() as any).get('auth_token')?.value
  if (token !== 'admin-logged-in') {
    redirect('/my-account')
  }
  return <SendNoticeClient />
}