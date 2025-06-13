// File: src/components/EditMaterialForm.js (Dengan Link Eksternal)
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditMaterialForm({ initialData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description || '');
  const [content, setContent] = useState(initialData.content || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.youtube_url || '');
  const [externalLink, setExternalLink] = useState(initialData.external_link || ''); // <-- State baru
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Memperbarui materi...');
    
    const { error } = await supabase
      .from('materials')
      .update({ 
        title, 
        description, 
        content, 
        youtube_url: youtubeUrl,
        external_link: externalLink // <-- Tambahkan ke data update
      })
      .eq('id', initialData.id);

    if (error) {
      setMessage('Gagal memperbarui: ' + error.message);
    } else {
      setMessage('Materi berhasil diperbarui!');
      router.push('/materi');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleUpdate} className="w-full max-w-lg p-8 space-y-4 bg-white rounded-lg shadow-md">
       <div><label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Materi</label><input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
       <div><label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label><input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
       <div><label htmlFor="content" className="block text-sm font-medium text-gray-700">Isi Materi (Teks)</label><textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="8" className="w-full mt-1 px-3 py-2 border rounded-md"></textarea></div>
       <div><label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">URL Video YouTube</label><input id="youtubeUrl" type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
       
       {/* Input Field Baru untuk Link Eksternal */}
       <div>
         <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700">Link Eksternal (Quizizz, Canva, dll.)</label>
         <input id="externalLink" type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." className="w-full mt-1 px-3 py-2 border rounded-md" />
       </div>

       <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">{isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}</button>
       {message && <p className="mt-2 text-center text-sm text-red-500">{message}</p>}
    </form>
  );
}