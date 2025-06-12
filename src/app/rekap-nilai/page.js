// File: src/app/rekap-nilai/page.js (VERSI FINAL DENGAN SEMUA PERBAIKAN)

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function RekapNilaiPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    userProfile = profile;
  }

  // Proteksi halaman: jika bukan guru, tampilkan pesan akses ditolak
  if (userProfile?.role !== 'guru') {
    return (
      <main className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div>
            <h1 className="text-3xl font-bold text-red-600">Akses Ditolak</h1>
            <p className="mt-2 text-lg text-gray-700">Halaman ini hanya bisa diakses oleh Guru.</p>
            <Link href="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Kembali ke Beranda
            </Link>
        </div>
      </main>
    );
  }

  // Ambil semua data submission yang SUDAH ADA NILAINYA
  const { data: gradedSubmissions, error } = await supabase
    .from('submissions')
    .select(`
      id,
      created_at,
      grade,
      teacher_feedback,
      assignments ( title ),
      profiles ( full_name, kelas )
    `)
    .not('grade', 'is', null)
    .order('created_at', { ascending: false });

  return (
    <main className="p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Rekapitulasi Nilai Siswa</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-semibold text-gray-600">Nama Siswa</th>
                  <th className="p-3 font-semibold text-gray-600">Kelas</th>
                  <th className="p-3 font-semibold text-gray-600">Tugas</th>
                  <th className="p-3 font-semibold text-gray-600">Nilai</th>
                  <th className="p-3 font-semibold text-gray-600">Tanggal Dinilai</th>
                </tr>
              </thead>
              <tbody>
                {gradedSubmissions?.length > 0 ? (
                  gradedSubmissions.map(sub => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{sub.profiles?.full_name || 'N/A'}</td>
                      <td className="p-3">{sub.profiles?.kelas || 'N/A'}</td>
                      <td className="p-3">{sub.assignments?.title || 'N/A'}</td>
                      <td className="p-3 font-bold text-blue-600">{sub.grade}</td>
                      <td className="p-3 text-gray-600">{new Date(sub.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      Belum ada nilai yang dimasukkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}