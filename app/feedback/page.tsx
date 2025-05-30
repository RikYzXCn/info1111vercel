'use client';
import { useState } from 'react';
import NavBar from '../components/NavBar';

export default function FeedbackPage() {
  const [message, setMessage]   = useState('');
  const [status,  setStatus]    = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/feedback.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      setStatus('✅ Thank you fot your feedback!');
      setMessage('');
    } else {
      setStatus(`❌ ${json.message || 'Failed'}`);
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Feedback & Suggestions</h1>
        {status && (
          <div className={`p-4 mb-4 rounded ${
            status.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="message"
            required
            placeholder="Enter your feedback…"
            className="border p-2 w-full h-32 rounded"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Submit Feedback
          </button>
        </form>
      </main>
    </div>
  );
}
