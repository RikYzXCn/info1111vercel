'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        setError(null);
        // 1) Call your API
        const res = await fetch('/api/notices');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // 2) Parse JSON
        const result = await res.json();
        // 3) Check your success flag
        if (!result.success) throw new Error(result.message || 'Unknown error');
        // 4) Everything’s great
        setNotices(result.data);
      } catch (err: any) {
        console.error('Failed to load notices:', err);
        setError(err.message ?? 'Failed to load notices');
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-xl space-y-6">
        <h1 className="text-3xl font-semibold">Notices</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : notices.length > 0 ? (
          <ul className="space-y-6">
            {notices.map(n => (
              <li key={n.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-bold">{n.title}</h2>
                <p className="mt-2 text-gray-700">{n.content}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notices at this time.</p>
        )}
      </main>
    </div>
  );
}