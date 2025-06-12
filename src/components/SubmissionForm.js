// File: src/components/SubmissionForm.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SubmissionForm({ assignmentId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Silakan pilih file untuk diunggah.');
      return;
    }
    if (!user) {
      setMessage('Anda harus login untuk mengumpulkan tugas.');
      return;
    }

    setUploading(true);
    setMessage('Mengunggah file...');

    // INI BARIS YANG KITA UBAH CARA PENULISANNYA
    const filePath = user.id + '/' + assignmentId + '-' + file.name;

    // 1. Upload file ke Storage
    const { error: uploadError } = await supabase.storage
      .from('file-submissions')
      .upload(filePath, file);

    if (uploadError) {
      setMessage('Gagal mengunggah file: ' + uploadError.message);
      setUploading(false);
      return;
    }
    
    // 2. Jika upload berhasil, catat di tabel 'submissions'
    const { error: insertError } = await supabase
      .from('submissions')
      .insert({
        assignment_id: assignmentId,
        student_id: user.id,
        file_path: filePath,
        notes: notes,
      });

    if (insertError) {
      setMessage('Gagal mencatat pengumpulan: ' + insertError.message);
    } else {
      setMessage('Tugas berhasil dikumpulkan!');
      router.refresh(); 
    }
    
    setUploading(false);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Pilih File Tugas</label>
          <input id="file-upload" type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        </div>
        <button type="submit" disabled={uploading} className="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-gray-400">
          {uploading ? 'Mengunggah...' : 'Kumpulkan Tugas'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}