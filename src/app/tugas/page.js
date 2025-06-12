// File: src/app/tugas/page.js (Dengan Layout Grid Baru)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function TugasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error);
    } else {
      setAssignments(data);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) {
        alert('Gagal menghapus tugas: ' + error.message);
      } else {
        alert('Tugas berhasil dihapus.');
        fetchAssignments();
      }
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchAssignments();
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <main className="flex flex-col items-center p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Halaman Tugas</h1>
            {user.profile?.role === 'guru' && (
                <Link href="/tugas/baru">
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-transform duration-200 hover:scale-105">
                        + Buat Tugas Baru
                    </button>
                </Link>
            )}
        </div>

        <p className="text-lg text-gray-600 mb-6">
            Selamat datang, {user.profile?.full_name || user.email}! 
            <span className="font-bold capitalize text-green-600 ml-2">({user.profile?.role})</span>
        </p>

        {/* --- BAGIAN GRID DIMULAI DI SINI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments?.length > 0 ? (
                assignments.map((tugas) => (
                    // Kita tidak bungkus semua dengan Link agar tombol Hapus berfungsi normal
                    <div key={tugas.id} className="h-full flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                        <Link href={`/tugas/${tugas.id}`}>
                            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-700">{tugas.title}</h2>
                        </Link>
                        <p className="flex-grow font-normal text-gray-700 mb-3">{tugas.description}</p>
                        <p className="text-sm text-red-600 font-semibold mb-4">Tenggat: {tugas.due_date}</p>

                        {/* Tombol-tombol hanya untuk guru */}
                        {user.profile?.role === 'guru' && (
                        <div className="flex space-x-2 mt-auto pt-4 border-t">
                          <Link href={`/tugas/edit/${tugas.id}`}>
                            <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                              Edit
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(tugas.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                ))
            ) : (
                <div className="col-span-1 md:col-span-2 text-center py-10">
                    <p className="text-gray-500">Belum ada tugas.</p>
                </div>
            )}
        </div>
        {/* --- AKHIR DARI GRID --- */}
        
      </div>
    </main>
  );
}