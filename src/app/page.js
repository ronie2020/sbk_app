// File: src/app/page.js (Dengan Desain Grid di Etalase Publik)

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: publicMaterials, error } = await supabase
    .from('materials')
    .select('id, title, description, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(6); // Ambil 6 materi terbaru untuk mengisi grid

  let userProfile = null;
  let upcomingAssignments = [];
  let ungradedSubmissions = [];

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single();
    userProfile = profile;

    if (userProfile?.role === 'siswa') {
      const { data: assignments } = await supabase
        .from('assignments')
        .select('*')
        .order('due_date', { ascending: true })
        .limit(3);
      upcomingAssignments = assignments || [];
    }

    if (userProfile?.role === 'guru') {
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, profiles(full_name), assignments(title)')
        .is('grade', null)
        .order('created_at', { ascending: false })
        .limit(5);
      ungradedSubmissions = submissions || [];
    }
  }

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">
          {user ? `Selamat Datang, ${userProfile?.full_name || 'Pengguna'}!` : 'Selamat Datang di Portal Pembelajaran Interaktif SMP'}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {user ? 'Ini adalah halaman dashboard Anda.' : 'Platform Pembelajaran Interaktif untuk SMP.'}
        </p>

        {user ? (
          <>
            {/* ... KODE DASHBOARD UNTUK GURU DAN SISWA TETAP SAMA ... */}
            {userProfile?.role === 'guru' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-xl font-bold mb-4">Tugas Perlu Dinilai</h2>{ungradedSubmissions.length > 0 ? <ul className="space-y-3">{ungradedSubmissions.map(sub => (<li key={sub.id} className="text-sm border-b pb-2"><span className="font-semibold">{sub.profiles.full_name}</span> baru saja mengumpulkan <span className="font-semibold text-blue-600">{sub.assignments.title}</span>.</li>))}</ul> : <p>Tidak ada tugas yang perlu dinilai.</p>}</div>
                 <div className="bg-white p-6 rounded-lg shadow space-y-4"><h2 className="text-xl font-bold mb-4">Pintasan Guru</h2><Link href="/tugas/baru" className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Buat Tugas Baru</Link><Link href="/materi/baru" className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Buat Materi Baru</Link></div>
              </div>
            )}
            {userProfile?.role === 'siswa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-xl font-bold mb-4">Tugas Mendatang</h2>{upcomingAssignments.length > 0 ? <ul className="space-y-3">{upcomingAssignments.map(tugas => (<li key={tugas.id} className="border-b pb-2"><Link href={`/tugas/${tugas.id}`} className="font-semibold text-blue-600 hover:underline">{tugas.title}</Link><p className="text-sm text-red-500">Tenggat: {tugas.due_date}</p></li>))}</ul> : <p>Tidak ada tugas mendatang.</p>}</div>
                <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-xl font-bold mb-4">Materi Terbaru</h2>{publicMaterials?.length > 0 ? <ul className="space-y-3">{publicMaterials.map(materi => (<li key={materi.id} className="border-b pb-2"><Link href={`/materi/${materi.id}`} className="font-semibold text-green-600 hover:underline">{materi.title}</Link></li>))}</ul> : <p>Belum ada materi baru.</p>}</div>
              </div>
            )}
          </>
        ) : (
          /* vvv PERUBAHAN UTAMA ADA DI SINI vvv */
          <div className="space-y-8">
            <div className="text-center p-10 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold">Akses Semua Fitur</h2>
              <p className="mt-2">Silakan login untuk mengakses tugas, mengumpulkan pekerjaan, dan melihat nilai.</p>
              <Link href="/login" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Login Sekarang</Link>
            </div>
            
            <div className="p-8 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Materi Terbaru</h2>
              {/* Menggunakan layout grid seperti halaman materi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicMaterials?.length > 0 ? (
                  publicMaterials.map(material => (
                    <Link href={`/materi/${material.id}`} key={material.id}>
                      <div className="h-full flex flex-col p-6 border rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <h3 className="text-xl font-bold text-gray-900">{material.title}</h3>
                        <p className="font-normal text-sm text-gray-600 mt-1">Oleh: {material.profiles?.full_name || 'Guru'}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">Belum ada materi yang ditambahkan.</p>
                )}
              </div>
            </div>
          </div>
          /* ^^^ AKHIR DARI PERUBAHAN ^^^ */
        )}
      </div>
    </main>
  );
}