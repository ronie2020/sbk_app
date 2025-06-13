// File: src/app/tugas/baru/page.js (Dengan Perbaikan)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function CreateAssignmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [externalLink, setExternalLink] = useState(''); // <-- PERBAIKAN DI SINI
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.profile.role !== 'guru')) {
      router.push('/tugas');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Menyimpan tugas...');

    const { error } = await supabase.from('assignments').insert([
      {
        title,
        description,
        due_date: dueDate,
        external_link: externalLink, // <-- Pastikan ini ada
        author_id: user.id,
      },
    ]);

    if (error) {
      setMessage('Gagal menyimpan tugas: ' + error.message);
    } else {
      setMessage('Tugas berhasil dibuat!');
      router.push('/tugas');
      router.refresh();
    }
    setIsSubmitting(false);
  };
  
  if (loading || !user || user.profile.role !== 'guru') {
    return <p>Loading atau Anda tidak punya akses...</p>;
  }

  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Buat Tugas Baru</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 space-y-4 bg-white rounded-lg shadow-md">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Tugas</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" rows="4"></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Tenggat Waktu</label>
          <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
        </div>
        {/* Input untuk link eksternal */}
        <div>
            <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700">Link Eksternal (Quizizz, Canva, dll.)</label>
            <input id="externalLink" type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 mt-1 border rounded-md" />
        </div>
        <div className="flex items-center gap-4 pt-4 border-t">
            <button type="button" onClick={() => router.back()} className="w-full px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                Batal
            </button>
            <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Tugas'}
            </button>
        </div>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </form>
    </main>
  );
}