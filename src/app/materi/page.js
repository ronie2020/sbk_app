// File: src/app/materi/page.js (Dengan Tombol Edit/Hapus)
'use client'; // <-- Ubah menjadi Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function MateriListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('id, title, description, profiles(full_name)')
      .order('created_at', { ascending: false });
    if (data) setMaterials(data);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else {
      fetchMaterials();
    }
  }, [user, loading, router]);

  const handleMaterialDelete = async (materialId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      const { error } = await supabase.from('materials').delete().eq('id', materialId);
      if (error) {
        alert('Gagal menghapus materi: ' + error.message);
      } else {
        alert('Materi berhasil dihapus.');
        fetchMaterials(); // Refresh daftar materi
      }
    }
  };

  if (loading || !user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <main className="flex flex-col items-center p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Materi Pelajaran</h1>
          {user.profile?.role === 'guru' && ( 
            <Link href="/materi/baru">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                + Buat Materi Baru
              </button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials?.length > 0 ? (
            materials.map(material => (
              <div key={material.id} className="h-full flex flex-col p-6 bg-white border rounded-lg shadow">
                <Link href={`/materi/${material.id}`}>
                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-700">{material.title}</h2>
                </Link>
                <p className="font-normal text-gray-600 text-sm mb-4">Oleh: {material.profiles?.full_name || 'Guru'}</p>
                <p className="flex-grow font-normal text-gray-700">
                  {material.description?.substring(0, 100) || 'Klik untuk melihat detail materi...'}
                  {material.description?.length > 100 && '...'}
                </p>
                {/* Tombol hanya untuk guru */}
                {user.profile?.role === 'guru' && (
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
      </div>
    </main>
  );
}