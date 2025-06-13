// File: src/app/tugas/page.js (VERSI FINAL DENGAN PERBAIKAN NAMA FUNGSI)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createServerClient } from '@supabase/ssr'; // <-- NAMA FUNGSI YANG BENAR
import { cookies } from 'next/headers';
import Link from 'next/link';
import TugasList from '@/components/TugasList';

export default async function TugasPageContainer() {
  const cookieStore = cookies();
  const supabase = createServerClient( // <-- NAMA FUNGSI YANG BENAR
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
    userProfile = profile;
  }

  // Jika user tidak terdeteksi atau bukan guru/siswa, bisa arahkan ke login
  if (!userProfile) {
    // Di sini Anda bisa menambahkan redirect jika perlu, tapi untuk sekarang kita biarkan
    // agar tidak error saat user belum login tapi RLS memperbolehkan lihat.
  }

  const { data: assignments, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });

  // Fungsi fetchAssignments tidak lagi dibutuhkan di sini karena halaman sudah server-component
  // dan akan me-render ulang pada navigasi. Refresh pada sisi client akan ditangani
  // oleh router.refresh() di dalam komponen client.

  return (
    <main className="flex flex-col items-center p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Halaman Tugas</h1>
            {userProfile?.role === 'guru' && (
                <Link href="/tugas/baru"><button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"> + Buat Tugas Baru</button></Link>
            )}
        </div>
        <p className="text-lg text-gray-600 mb-6">
            Selamat datang, {userProfile?.full_name || user?.email}! 
            <span className="font-bold capitalize text-green-600 ml-2">({userProfile?.role || 'Tamu'})</span>
        </p>
        
        {/* Melempar data ke Client Component */}
        {/* Kita perlu sedikit memodifikasi TugasList untuk menangani refresh */}
        <TugasList initialAssignments={assignments || []} user={{...user, profile: userProfile}} />
      </div>
    </main>
  );
}