import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SendGeneralNoticeClient from './SendGeneralNoticeClient';

export default function SendGeneralNoticePage() {
  const token = (cookies() as any).get('auth_token')?.value;
  if (token !== 'admin-logged-in') redirect('/my-account');
  return <SendGeneralNoticeClient />;
}
