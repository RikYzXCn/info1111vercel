'use client'

import { useState } from 'react'
import NavBar from '../components/NavBar'

export default function HTMLRenovationForm() {
  // State for GET query
  const [queryRoom, setQueryRoom] = useState('')
  const [queryResult, setQueryResult] = useState<any[] | null>(null)

  // State for POST submission
  const [form, setForm] = useState({
    roomNumber: '',
    company: '',
    phone: '',
    schedule: ''
  })
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null)

  // Handle GET query
  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    setQueryResult(null)
    try {
      const res = await fetch(`/api/query-repair?roomNumber=${encodeURIComponent(queryRoom)}`)
      const result = await res.json()
      if (res.ok && result.success) {
        setQueryResult(result.data)
      } else {
        setQueryResult([])
      }
    } catch {
      setQueryResult([])
    }
  }

  // Handle POST submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus(null)
    try {
      const res = await fetch('/api/submit-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setSubmitStatus({ success: true, message: `Request #${result.record.id} submitted!` })
        setForm({ roomNumber: '', company: '', phone: '', schedule: '' })
      } else {
        setSubmitStatus({ success: false, message: result.error || `HTTP ${res.status}` })
      }
    } catch (err: any) {
      setSubmitStatus({ success: false, message: err.message })
    }
  }

  const inputClass = 'border p-2 w-full rounded'

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-xl space-y-12">
        
        {/* GET Section */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Check Existing Requests</h2>
          <form onSubmit={handleQuery} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Room Number"
              className={inputClass}
              value={queryRoom}
              onChange={e => setQueryRoom(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </form>
          {queryResult !== null && (
            queryResult.length > 0 ? (
              <ul className="space-y-3">
                {queryResult.map(r => (
                  <li key={r.id} className="border-l-4 border-blue-600 pl-4">
                    <p><strong>Room:</strong> {r.room_number}</p>
                    <p><strong>Company:</strong> {r.company}</p>
                    <p><strong>Phone:</strong> {r.phone}</p>
                    <p><strong>Schedule:</strong> {r.schedule}</p>
                    <p className="text-sm text-gray-500">
                      Submitted at {new Date(r.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">No requests found for room <strong>{queryRoom}</strong>.</p>
            )
          )}
        </section>

        {/* POST Section */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Submit New Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="roomNumber"
              placeholder="Room Number"
              className={inputClass}
              value={form.roomNumber}
              onChange={e => setForm({ ...form, roomNumber: e.target.value })}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Renovation Company"
              className={inputClass}
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Contact Phone"
              className={inputClass}
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              type="text"
              name="schedule"
              placeholder="Preferred Schedule"
              className={inputClass}
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Request
            </button>
          </form>

          {submitStatus && (
            <div
              className={`mt-4 p-4 rounded ${
                submitStatus.success
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submitStatus.success ? '✅' : '❌'} {submitStatus.message}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
