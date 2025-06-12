// Buka file: src/app/tugas/edit/[id]/page.js (Ganti semua isinya dengan ini)

import { supabase } from '@/lib/supabaseClient';
import EditAssignmentForm from '@/components/EditAssignmentForm';
import { notFound } from 'next/navigation';

// Ini adalah Server Component, bisa async
export default async function EditAssignmentPage({ params }) {

  // Ambil data tugas di server
  const { data: assignment, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', params.id)
    .single();

  // Jika tugas tidak ditemukan, tampilkan halaman 404
  if (error || !assignment) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Edit Tugas</h1>
      {/* Berikan data tugas ke komponen form sebagai 'initialData' */}
      <EditAssignmentForm initialData={assignment} />
    </main>
  );
}