import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DocumentsClient from './DocumentsClient';

export default function DocumentsPage() {
  const cookieStore = cookies() as any;
  const token = cookieStore.get('auth_token')?.value;
  const username = cookieStore.get('username')?.value;
  if (!token || !username) redirect('/my-account');
  return <DocumentsClient username={username} />;
}