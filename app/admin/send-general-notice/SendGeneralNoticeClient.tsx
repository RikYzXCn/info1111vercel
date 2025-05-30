'use client';

import { useState } from 'react';

export default function SendGeneralNoticeClient() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/admin/send-general-notice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await res.json();
    if (res.ok && result.success) {
      setStatus('✅ General notice sent');
      setForm({ title: '', content: '' });
    } else {
      setStatus(`❌ ${result.message || 'Failed to send'}`);
    }
  };

  return (
    <div className="flex">
      <main className="p-6 md:ml-64 max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Send General Notice (Admin)</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            className="border p-2 w-full rounded"
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
            className="border p-2 w-full h-32 rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Send Notice
          </button>
        </form>
        {status && <p>{status}</p>}
      </main>
    </div>
  );
}