// File: src/components/TugasList.js (Versi Final dengan Client Baru)
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // <-- 1. Ganti import

// Menerima 'initialAssignments' dan 'user' sebagai props
export default function TugasList({ initialAssignments, user }) {
  const router = useRouter();
  const supabase = createClient(); // <-- 2. Buat client di sini

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);

      if (error) {
        alert('Gagal menghapus tugas: ' + error.message);
      } else {
        alert('Tugas berhasil dihapus.');
        router.refresh(); // Refresh halaman untuk memuat ulang data dari server
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {initialAssignments?.length > 0 ? (
        initialAssignments.map((tugas) => (
          <div key={tugas.id} className="h-full flex flex-col p-6 bg-white border rounded-lg shadow hover:shadow-xl transition-shadow">
            <Link href={`/tugas/${tugas.id}`}>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-700">{tugas.title}</h2>
            </Link>
            <p className="flex-grow font-normal text-gray-700 mb-3">{tugas.description}</p>
            <p className="text-sm text-red-600 font-semibold mb-4">Tenggat: {tugas.due_date}</p>
            {user.profile?.role === 'guru' && (
              <div className="flex space-x-2 mt-auto pt-4 border-t">
                <Link href={`/tugas/edit/${tugas.id}`}><button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded">Edit</button></Link>
                <button onClick={() => handleDelete(tugas.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded">Hapus</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="col-span-1 md:col-span-2 text-center py-10"><p className="text-gray-500">Belum ada tugas.</p></div>
      )}
    </div>
  );
}