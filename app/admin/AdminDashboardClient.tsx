'use client';

import { useState } from 'react';
import NavBar from '../components/NavBar';
import SendTaxNoticeClient from './send-notice/SendNoticeClient';
import SendGeneralNoticeClient from './send-general-notice/SendGeneralNoticeClient';

export default function AdminDashboardClient() {
  const [tab, setTab] = useState<'tax' | 'general'>('tax');

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-xl space-y-6">
        <h1 className="text-3xl font-bold">Admin Control Panel</h1>
        <div className="flex space-x-4 border-b pb-2">
          <button
            onClick={() => setTab('tax')}
            className={tab === 'tax' ? 'font-semibold border-b-2 border-blue-500' : 'text-gray-600'}
          >
            Send Tax Notice
          </button>
          <button
            onClick={() => setTab('general')}
            className={tab === 'general' ? 'font-semibold border-b-2 border-blue-500' : 'text-gray-600'}
          >
            Send General Notice
          </button>
        </div>
        <div>
          {tab === 'tax' ? <SendTaxNoticeClient /> : <SendGeneralNoticeClient />}
        </div>
      </main>
    </div>
  );
}