// File: src/app/materi/[id]/page.js (Versi Final dengan Semua Fitur)

export const dynamic = 'force-dynamic';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import BackButton from '@/components/BackButton';

// Fungsi bantuan untuk mengambil ID video dari URL YouTube
function getYoutubeVideoId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function MateriDetailPage({ params }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: material, error } = await supabase
    .from('materials')
    .select('*, profiles(full_name)')
    .eq('id', params.id)
    .single();

  if (error || !material) {
    notFound();
  }

  const videoId = getYoutubeVideoId(material.youtube_url);

  return (
    <main className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-3xl">
        <BackButton />
        <div className="bg-white p-8 rounded-lg shadow-md mt-4">
            <h1 className="text-4xl font-bold mb-2">{material.title}</h1>
            <p className="text-md text-gray-600 mb-8">Oleh: {material.profiles?.full_name || 'Guru'}</p>
            
            {/* Tampilkan konten teks jika ada */}
            {material.content && (
              <div className="prose max-w-none mb-8">
                <p className="whitespace-pre-wrap">{material.content}</p>
              </div>
            )}
            
            {/* Jika ada ID video, tampilkan pemutar video */}
            {videoId && (
              <div className="my-8">
                <h3 className="text-2xl font-semibold mb-4">Video Pembelajaran</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                    style={{ aspectRatio: '16 / 9' }}
                  ></iframe>
                </div>
              </div>
            )}

            {/* Tombol Link Eksternal (jika ada) */}
            {material.external_link && (
                <div className="my-8 py-6 border-t">
                    <a 
                        href={material.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Buka Tautan Eksternal
                    </a>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}