// File: src/app/tugas/page.js (Versi Server Component)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import TugasList from '@/components/TugasList'; // Impor komponen baru

export default async function TugasPageContainer() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getSession();

  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
    userProfile = profile;
  }

  const { data: assignments } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });

  // Kita butuh fungsi ini di client, jadi kita lewatkan sebagai string
  const fetchAssignmentsAction = `
    'use server';
    import { createServerActionClient } from '@supabase/ssr';
    import { cookies } from 'next/headers';
    import { revalidatePath } from 'next/cache';

    export async function fetchAssignments() {
      revalidatePath('/tugas');
    }
  `;

  return (
    <main className="flex flex-col items-center p-8 md:p-12 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Halaman Tugas</h1>
            {userProfile?.role === 'guru' && (
                <Link href="/tugas/baru"><button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow"> + Buat Tugas Baru</button></Link>
            )}
        </div>
        <p className="text-lg text-gray-600 mb-6">
            Selamat datang, {userProfile?.full_name || user?.email}! 
            <span className="font-bold capitalize text-green-600 ml-2">({userProfile?.role})</span>
        </p>
        {/* Melempar data ke Client Component */}
        <TugasList assignments={assignments || []} user={{profile: userProfile}} fetchAssignments={fetchAssignmentsAction} />
      </div>
    </main>
  );
}