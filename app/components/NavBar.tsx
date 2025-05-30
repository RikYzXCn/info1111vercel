'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? 'bg-blue-500 text-white'
        : 'text-blue-700 hover:bg-blue-100'
    }`;

  return (
    <aside className="w-64 min-h-screen bg-blue-50 p-4 shadow-md">
      <h2 className="text-lg font-bold mb-4 text-blue-700">Strata Management</h2>
      <nav className="flex flex-col gap-2">
        <Link href="/"      className={linkClass('/')}>Home</Link>
        <Link href="/my-account" className={linkClass('/my-account')}>My Account</Link>
        <Link href="/notices" className={linkClass('/notices')}>Notices</Link>
        <Link href="/contact" className={linkClass('/contact')}>Contact Us</Link>
        <Link href="/documents" className={linkClass('/documents')}>Documents</Link>
        <Link href="/tax-notices" className={linkClass('/tax-notices')}>Tax Notices</Link>
        <Link href="/parking-application" className={linkClass('/parking-application')}>Parking Application</Link>
        <Link href="/renovation-request" className={linkClass('/renovation-request')}>Renovation Request</Link>
        <Link href="/feedback" className={linkClass('/feedback')}>Feedback</Link>
        <Link href="/admin" className={linkClass('/admin')}>Admin</Link>
      </nav>
    </aside>
  );
}