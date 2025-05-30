import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export const runtime = 'edge';

export default function AdminDashboardPage() {
  // Server-side authentication check
  const token = (cookies() as any).get('auth_token')?.value;
  if (token !== 'admin-logged-in') {
    redirect('/my-account');
  }

  // Client-side state for tab selection
  // Use a client component via 'use client' wrapper below
  return (
    <AdminDashboardClient />
  );
}