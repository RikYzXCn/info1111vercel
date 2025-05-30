'use client';
import NavBar from '../components/NavBar';
import { useState } from 'react';

export default function ParkingApplication() {
  const [form, setForm] = useState({
    name: '',
    license: '',
    phone: ''
  });
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/submit-parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
          // If HTTP status is not OK, show that error
    if (!res.ok) {
      throw new Error(result.error || `HTTP ${res.status}`);
    }

    // If API-level success flag is false, show that error
    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    // ✅ All good!
    setConfirmation(`✅ Application #${result.record.id} submitted!`);
    setForm({ name: '', license: '', phone: '' });

  } catch (err) {
    console.error('Submit error:', err);
    setConfirmation(`❌ ${err.message}`);
  }
};

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-xl">
        <h1 className="text-3xl font-bold mb-4">Parking Slot Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="border p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            name="license"
            type="text"
            placeholder="License Plate"
            className="border p-2 w-full"
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            className="border p-2 w-full"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Application
          </button>
        </form>
        {confirmation && (
          <div className="mt-4 text-green-600 font-semibold">{confirmation}</div>
        )}
      </main>
    </div>
  );
}