'use client';
import { useState } from 'react';

export default function SendNoticePage() {
  const [form, setForm] = useState({ username: '', notice: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/admin/send-notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await res.json();
    if (res.ok && result.success) {
      setStatus('✅ Notice sent successfully');
      setForm({ username: '', notice: '' });
    } else {
      setStatus(`❌ ${result.message}`);
    }
  };

  return (
    <div className="flex">
      <main className="p-6 md:ml-64 max-w-md">
        <h1 className="text-3xl font-bold mb-4">Send Tax Notice (Admin)</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Target Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <textarea
            name="notice"
            placeholder="Notice Content"
            value={form.notice}
            onChange={e => setForm({ ...form, notice: e.target.value })}
            required
            className="border p-2 w-full h-24 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send Notice
          </button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </main>
    </div>
  );
}
