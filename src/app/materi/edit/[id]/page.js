// File: src/app/materi/edit/[id]/page.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EditMaterialForm from '@/components/EditMaterialForm';

export const dynamic = 'force-dynamic';

export default async function EditMaterialPage({ params }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: material } = await supabase.from('materials').select('*').eq('id', params.id).single();
  if (!material) notFound();

  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Materi</h1>
      <EditMaterialForm initialData={material} />
    </main>
  );
}