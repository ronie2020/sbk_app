// File: src/components/Navbar.js (Dengan Posisi Link yang Benar)
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Netila Interaktif Sistem
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-gray-300">Beranda</Link>
          <Link href="/materi" className="hover:text-gray-300">Materi</Link>
          <Link href="/tugas" className="hover:text-gray-300">Tugas</Link>
          
          {/* Logika untuk menampilkan menu login/logout dipindahkan ke sini */}
          {loading ? (
            <p className="text-sm">...</p>
          ) : user ? (
            <>
              {/* vvv PINDAHKAN LINK REKAP NILAI KE SINI vvv */}
              {/* Link ini hanya muncul jika user ada DAN perannya adalah guru */}
              {user.profile?.role === 'guru' && (
                <Link href="/rekap-nilai" className="hover:text-gray-300">
                    Rekap Nilai
                </Link>
              )}

              <span className="text-sm bg-gray-700 px-2 py-1 rounded">{user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}