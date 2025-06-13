// File: src/app/materi/page.js (Versi Server Component Cepat)

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import MaterialList from '@/components/MaterialList'; // Impor komponen baru

export default async function MateriPageContainer() {
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

  const { data: materials, error } = await supabase
    .from('materials')
    .select('id, title, description, profiles(full_name)')
    .order('created_at', { ascending: false });

  return (
    <main className="flex flex-col items-center p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Materi Pelajaran</h1>
          {userProfile?.role === 'guru' && ( 
            <Link href="/materi/baru">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                + Buat Materi Baru
              </button>
            </Link>
          )}
        </div>

        {/* Melempar data ke Client Component untuk ditampilkan */}
        <MaterialList materials={materials || []} user={{...user, profile: userProfile}} />

      </div>
    </main>
  );
}