'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';

export default function MyAccountClient() {
  const router = useRouter();
  const [mode, setMode]     = useState<'login'|'register'>('login');
  const [form, setForm]     = useState({ username: '', password: '', confirm: '' });
  const [error, setError]   = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string>('');

  // Fetch auth status once on mount
  useEffect(() => {
    fetch('/api/check-auth')
      .then(r => r.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
        if (data.loggedIn && data.username) {
          setUsername(data.username);
        }
      });
  }, []);

  const handleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'POST' });
    if (res.ok) {
      setLoggedIn(false);
      router.push('/my-account');
    } else {
      setError('Logout failed');
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.username, password: form.password })
    });
    const result = await res.json();
    if (res.ok && result.success) {
      router.refresh();
    } else {
      setError(result.message || 'Login failed');
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.username, password: form.password })
    });
    const result = await res.json();
    if (res.ok && result.success) {
      setMode('login');
      setForm({ username: '', password: '', confirm: '' });
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-md space-y-6">
        <h1 className="text-3xl font-bold">My Account</h1>

        {loggedIn === null ? (
          <p>Loading...</p>
        ) : loggedIn ? (
          <div className="space-y-4">
            <p>Welcome, <strong>{username}</strong>!</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('login')}
                className={mode === 'login' ? 'underline font-semibold' : ''}
              >
                Login
              </button>
              <button
                onClick={() => setMode('register')}
                className={mode === 'register' ? 'underline font-semibold' : ''}
              >
                Register
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                  className="border p-2 w-full rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="border p-2 w-full rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                  className="border p-2 w-full rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="border p-2 w-full rounded"
                />
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  required
                  className="border p-2 w-full rounded"
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                  Register
                </button>
              </form>
            )}

            {error && <p className="text-red-600">❌ {error}</p>}
          </>
        )}
      </main>
    </div>
  );
}