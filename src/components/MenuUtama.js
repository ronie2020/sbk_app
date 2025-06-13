// File: src/components/MenuUtama.js (Responsif dengan Hamburger Menu)
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MenuUtama() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = (
    <>
      <Link href="/" className="block md:inline-block py-2 px-4 hover:text-gray-300">Beranda</Link>
      <Link href="/materi" className="block md:inline-block py-2 px-4 hover:text-gray-300">Materi</Link>
      <Link href="/tugas" className="block md:inline-block py-2 px-4 hover:text-gray-300">Tugas</Link>
      {user?.profile?.role === 'guru' && (
        <Link href="/rekap-nilai" className="block md:inline-block py-2 px-4 hover:text-gray-300">Rekap Nilai</Link>
      )}
    </>
  );

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Netila Interaktif Sistem</Link>

        {/* Navigasi untuk Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks}
          {loading ? <p>...</p> : user ? (
            <>
              <span className="text-sm bg-gray-700 px-2 py-1 rounded">{user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Logout</button>
            </>
          ) : <Link href="/login" className="bg-indigo-600 px-3 py-1 rounded">Login</Link>}
        </div>

        {/* Tombol Hamburger untuk Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile yang bisa expand/collapse */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          {navLinks}
          <div className="mt-4 pt-4 border-t border-gray-700">
          {loading ? <p>...</p> : user ? (
            <div className="flex flex-col items-start space-y-3">
              <span className="text-sm px-4">{user.email}</span>
              <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded w-full text-left">Logout</button>
            </div>
          ) : <Link href="/login" className="bg-indigo-600 block text-center py-2 px-4 rounded">Login</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}