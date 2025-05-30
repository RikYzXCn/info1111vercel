'use client';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { supabase } from '@/lib/supabaseClient';

interface FileEntry { name: string; url: string }

export default function DocumentsClient({ username }: { username: string }) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [filesList, setFilesList] = useState<FileEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => { fetchFiles(); }, []);

  async function fetchFiles() {
    setError(null);
    const path = `uploads/${username}`;
    const { data, error: listError } = await supabase.storage.from('documents').list(path);
    if (listError) { setError(listError.message); return; }
    const entries: FileEntry[] = [];
    for (const f of data) {
      const { data: urlData, error: urlErr } = await supabase.storage
        .from('documents')
        .createSignedUrl(`${path}/${f.name}`, 60);
      if (!urlErr) entries.push({ name: f.name, url: urlData.signedUrl });
    }
    setFilesList(entries);
  }

  async function handleUpload() {
    if (!selectedFiles) return;
    setUploading(true);
    setError(null);
    setUploadSuccess(false);
    const files = Array.from(selectedFiles);
    const basePath = `uploads/${username}`;
    let allSuccess = true;
    for (const file of files) {
      const p = `${basePath}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('documents').upload(p, file, { upsert: false });
      if (uploadError) { setError(`Failed ${file.name}: ${uploadError.message}`); allSuccess = false; break; }
    }
    setUploading(false);
    if (allSuccess) { setUploadSuccess(true); fetchFiles(); }
  }

  return (
    <div className="flex">
      <NavBar />
      <main className="p-6 md:ml-64 max-w-xl space-y-6">
        <h1 className="text-3xl font-semibold">Document Storage</h1>
        <section className="bg-white p-6 rounded shadow space-y-4">
          <p>Upload your docs. Only you see your files.</p>
          <input type="file" multiple onChange={e => setSelectedFiles(e.target.files)} />
          <button onClick={handleUpload} disabled={uploading||!selectedFiles}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
          {uploadSuccess && <div className="p-4 bg-green-100 text-green-800 rounded">✅ Uploaded!</div>}
          {error && <p className="text-red-600">Error: {error}</p>}
        </section>
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          {filesList.length===0 ? (
            <p className="text-gray-500">No documents uploaded.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {filesList.map(f => (
                <li key={f.name}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {f.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
