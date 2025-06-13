// File: src/app/tugas/[id]/page.js (Versi Lengkap dan Final)
export const dynamic = 'force-dynamic';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import SubmissionForm from '@/components/SubmissionForm';
import BackButton from '@/components/BackButton';
import GradingForm from '@/components/GradingForm';

export default async function AssignmentDetailPage({ params }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  const { data: assignment, error } = await supabase.from('assignments').select('*').eq('id', params.id).single();
  if (error || !assignment) notFound();

  let userProfile = null;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    userProfile = profile;
  }

  let submission = null;
  if (user && userProfile?.role === 'siswa') {
    const { data } = await supabase.from('submissions').select('*').eq('assignment_id', params.id).eq('student_id', user.id).maybeSingle();
    submission = data;
  }
  
  let allSubmissions = [];
  if (user && userProfile?.role === 'guru') {
    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('*, profiles(full_name, kelas)')
      .eq('assignment_id', params.id);
    
    if (submissionsData) {
      allSubmissions = await Promise.all(
        submissionsData.map(async (sub) => {
          const { data: urlData, error: urlError } = await supabase.storage.from('file-submissions').createSignedUrl(sub.file_path, 60);
          return { ...sub, downloadUrl: urlError ? null : urlData.signedUrl };
        })
      );
    }
  }

  return (
    <main className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl">
        <BackButton />
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-2">{assignment.title}</h1>
            <p className="text-lg text-red-600 mb-6">Tenggat: {assignment.due_date}</p>
            <div className="prose max-w-none"><p>{assignment.description}</p></div>
            {/* vvv TAMBAHKAN BLOK INI vvv */}
            {assignment.external_link && (
                <div className="mt-6">
                    <a 
                        href={assignment.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                        Buka Tautan Tugas
                    </a>
                </div>
            )}
            <hr className="my-8" />
            <h2 className="text-2xl font-semibold mb-4">Pengumpulan Tugas</h2>

            {/* vvv BAGIAN YANG KOSONG KITA ISI KEMBALI DI SINI vvv */}
            {userProfile?.role === 'siswa' && (
              <>
                {submission ? (
                  submission.grade ? (
                    <div className="p-4 bg-blue-100 text-blue-800 rounded-md">
                      <h3 className="text-xl font-bold">Hasil Penilaian</h3>
                      <p className="text-2xl my-2">Nilai Anda: <span className="font-extrabold">{submission.grade}</span></p>
                      <p className="font-semibold">Feedback dari Guru:</p>
                      <p className="mt-1 whitespace-pre-wrap">{submission.teacher_feedback}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-100 text-green-800 rounded-md">
                      <p className="font-bold">Anda sudah mengumpulkan tugas ini.</p>
                      <p>Tugas Anda sedang menunggu untuk diperiksa oleh guru.</p>
                    </div>
                  )
                ) : (
                  <SubmissionForm assignmentId={assignment.id} />
                )}
              </>
            )}

            {userProfile?.role === 'guru' && (
              <div>
                <h3 className="text-xl font-bold">Daftar Siswa yang Mengumpulkan</h3>
                {allSubmissions.length > 0 ? (
                  <ul className="mt-4 space-y-4">
                    {allSubmissions.map(sub => (
                      <li key={sub.id} className="p-3 border rounded-md">
                        <p>
                          <strong>{sub.profiles?.full_name || 'Siswa...'}</strong>
                          <span className="text-gray-500 ml-2">({sub.profiles?.kelas || 'Tanpa Kelas'})</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-2">Mengumpulkan pada: {new Date(sub.created_at).toLocaleString()}</p>
                        <p>File: <a href={sub.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">{sub.file_path.split('/').pop()}</a></p>
                        <GradingForm submission={sub} />
                      </li>
                    ))}
                  </ul>
                ) : ( <p>Belum ada siswa yang mengumpulkan tugas.</p> )}
              </div>
            )}
            
            {!user && <p>Silakan login sebagai siswa untuk mengumpulkan tugas.</p>}
        </div>
      </div>
    </main>
  );
}