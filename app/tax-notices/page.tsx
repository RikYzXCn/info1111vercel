import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TaxNoticesClient from './TaxNoticesClient';

export default function TaxNoticesPage() {
  const cookieStore = cookies() as any;
  const token = cookieStore.get('auth_token')?.value;
  const username = cookieStore.get('username')?.value;
  if (!token || !username) {
    redirect('/my-account');
  }
  return <TaxNoticesClient username={username} />;
}