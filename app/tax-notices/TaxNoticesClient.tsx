'use client';

import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { supabase } from '@/lib/supabaseClient';

export default function TaxNoticesClient({ username }: { username: string }) {
  const [notices, setNotices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotices() {
      setError(null);
      const { data, error } = await supabase
        .from('tax_notices')
        .select('notice')
        .eq('username', username)
        .order('created_at', { ascending: false });
      if (error) {
        setError(error.message);
      } else if (data) {
        setNotices(data.map(item => item.notice));
      }
      setLoading(false);
    }
    loadNotices();
  }, [username]);

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-xl space-y-6">
        <h1 className="text-3xl font-semibold">Tax Notices</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : notices.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {notices.map((n, idx) => (
              <li key={idx} className="text-gray-800">{n}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tax notices available.</p>
        )}
      </main>
    </div>
  );
}