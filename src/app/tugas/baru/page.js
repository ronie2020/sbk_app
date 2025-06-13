// File: src/app/tugas/baru/page.js (Versi Final dengan Arsitektur Baru)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';

export default function CreateAssignmentPage() {
  const { session, loading: authLoading } = useAuth(); // Ambil sesi dari context
  const user = session?.user;

  const router = useRouter();
  const supabase = createClient();
  
  const [profile, setProfile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect untuk mengambil data profil guru
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [user, supabase]);

  // useEffect untuk proteksi halaman
  useEffect(() => {
    // Jika loading auth selesai DAN (tidak ada user ATAU rolenya bukan guru)
    if (!authLoading && (!user || (profile && profile.role !== 'guru'))) {
      alert('Halaman ini hanya untuk Guru.');
      router.push('/tugas');
    }
  }, [user, profile, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Menyimpan tugas...');

    const { error } = await supabase.from('assignments').insert([
      {
        title,
        description,
        due_date: dueDate,
        external_link: externalLink,
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
  
  // Tampilkan pesan loading jika data auth atau profil belum siap
  if (authLoading || !profile) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <main className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Buat Tugas Baru</h1>
        <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-white rounded-lg shadow-md">
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
          <div>
            <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700">Link Eksternal (Opsional)</label>
            <input id="externalLink" type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." className="w-full mt-1 px-3 py-2 border rounded-md" />
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
      </div>
    </main>
  );
}