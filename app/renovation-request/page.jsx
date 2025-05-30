'use client';
import Link from 'next/link';
import { useState } from 'react';
import NavBar from '../components/NavBar';

export default function RenovationRequest() {
  const [form, setForm] = useState({ roomNumber: '', company: '', phone: '', schedule: '' });
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmation('');
    try {
      const res = await fetch('/api/submit-renovation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || `HTTP ${res.status}`);
      setConfirmation(`✅ Request #${result.record.id} submitted successfully!`);
      setForm({ roomNumber: '', company: '', phone: '', schedule: '' });
    } catch (err) {
        console.error('Submission error:', err);
        setConfirmation(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-md">
        <h1 className="text-3xl font-bold mb-4">Renovation Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            className="border p-2 w-full"
            value={form.roomNumber}
            onChange={e => setForm({ ...form, roomNumber: e.target.value })}
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Renovation Company"
            className="border p-2 w-full"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Contact Phone"
            className="border p-2 w-full"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="text"
            name="schedule"
            placeholder="Preferred Schedule"
            className="border p-2 w-full"
            value={form.schedule}
            onChange={e => setForm({ ...form, schedule: e.target.value })}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Submit Request
          </button>
        </form>
        {confirmation && (
          <div className="mt-4 text-sm font-semibold">
            {confirmation.startsWith('✅') ?
              <p className="text-green-600">{confirmation}</p> :
              <p className="text-red-600">{confirmation}</p>
            }
          </div>
        )}
        <div className="mt-8">
          <p className="text-3xl font-semibold">Check My Request</p>
          <Link href="/html-form">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Go To HTML Form</button>
          </Link>
        </div>
      </main>
    </div>
  );
}