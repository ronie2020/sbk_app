// File: src/components/CreateMaterialForm.js (Dengan Link Eksternal)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function CreateMaterialForm() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [externalLink, setExternalLink] = useState(''); // <-- State baru
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Anda harus login sebagai guru untuk membuat materi.');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('Menyimpan materi...');

    const { error } = await supabase.from('materials').insert([
      {
        title,
        description,
        content,
        youtube_url: youtubeUrl,
        external_link: externalLink, // <-- Tambahkan ke data insert
        author_id: user.id,
      },
    ]);

    if (error) {
      setMessage('Gagal menyimpan materi: ' + error.message);
    } else {
      setMessage('Materi berhasil dibuat!');
      router.push('/materi');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 space-y-4 bg-white rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Materi</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
        <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Satu atau dua kalimat ringkasan materi..." className="w-full px-3 py-2 mt-1 border rounded-md" />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Isi Materi (Teks)</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" rows="8"></textarea>
      </div>
      
      <div>
        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">URL Video YouTube (Opsional)</label>
        <input id="youtubeUrl" type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 mt-1 border rounded-md" />
      </div>

      {/* Input Field Baru untuk Link Eksternal */}
      <div>
        <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700">Link Eksternal (Quizizz, Canva, dll.)</label>
        <input id="externalLink" type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 mt-1 border rounded-md" />
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <button type="button" onClick={() => router.back()} className="w-full px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Batal
        </button>
        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {isSubmitting ? 'Menyimpan...' : 'Simpan Materi'}
        </button>
      </div>
      
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </form>
  );
}