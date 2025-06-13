// File: src/components/MaterialList.js
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Menerima 'materials' dan 'user' sebagai props
export default function MaterialList({ materials, user }) {
  const router = useRouter();

  const handleMaterialDelete = async (materialId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      const { error } = await supabase.from('materials').delete().eq('id', materialId);

      if (error) {
        alert('Gagal menghapus materi: ' + error.message);
      } else {
        alert('Materi berhasil dihapus.');
        router.refresh(); // Refresh halaman untuk memuat ulang data dari server
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials?.length > 0 ? (
        materials.map(material => (
          <div key={material.id} className="h-full flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl transition-shadow">
            <Link href={`/materi/${material.id}`}>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-700">{material.title}</h2>
            </Link>
            <p className="font-normal text-gray-600 text-sm mb-4">Oleh: {material.profiles?.full_name || 'Guru'}</p>
            <p className="flex-grow font-normal text-gray-700">
              {material.description?.substring(0, 100) || 'Klik untuk melihat detail materi...'}
              {material.description?.length > 100 && '...'}
            </p>
            {/* Tombol hanya untuk guru */}
            {user?.profile?.role === 'guru' && (
              <div className="flex space-x-2 mt-auto pt-4 border-t">
                <Link href={`/materi/edit/${material.id}`}>
                  <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                </Link>
                <button onClick={() => handleMaterialDelete(material.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10"><p className="text-gray-500">Belum ada materi yang ditambahkan.</p></div>
      )}
    </div>
  );
}