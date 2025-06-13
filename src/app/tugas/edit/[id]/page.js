// File: src/app/tugas/edit/[id]/page.js (Perbaikan)

import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EditAssignmentForm from '@/components/EditAssignmentForm';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

export default async function EditAssignmentPage({ params }) {
  const supabase = createClient(); // <-- INI BAGIAN PENTING YANG HILANG

  // Ambil data tugas spesifik di server
  const { data: assignment, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', params.id)
    .single();

  // Jika tidak ditemukan, tampilkan halaman 404
  if (error || !assignment) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6 mt-4 text-center">Edit Tugas</h1>
        {/* Kirim data awal ke komponen form */}
        <EditAssignmentForm initialData={assignment} />
      </div>
    </main>
  );
}