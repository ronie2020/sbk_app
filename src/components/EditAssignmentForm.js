// File: src/components/EditAssignmentForm.js (Pengecekan Ulang)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditAssignmentForm({ initialData }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.due_date);
  const [externalLink, setExternalLink] = useState(initialData.external_link || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Memperbarui tugas...');

    const { error } = await supabase
      .from('assignments')
      .update({
        title,
        description,
        due_date: dueDate,
        external_link: externalLink,
      })
      .eq('id', initialData.id);

    if (error) {
      setMessage('Gagal memperbarui: ' + error.message);
    } else {
      setMessage('Tugas berhasil diperbarui!');
      router.push('/tugas');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleUpdate} className="w-full p-8 space-y-4 bg-white rounded-lg shadow-md">
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
        <input id="externalLink" type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 mt-1 border rounded-md" />
      </div>
      <div className="flex items-center gap-4 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="w-full px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Batal
          </button>
          <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
          </button>
      </div>
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </form>
  );
}