// File: src/app/materi/[id]/page.js
import BackButton from '@/components/BackButton';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
    <main className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl"> {/* <-- Tambahkan div pembungkus ini */}

        <BackButton /> {/* <-- LETAKKAN TOMBOLNYA DI SINI */}

        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-2">{material.title}</h1>
          <p className="text-md text-gray-600 mb-8">Oleh: {material.profiles?.full_name || 'Guru'}</p>

          {videoId && (
            <div className="aspect-w-16 aspect-h-9 mb-6">
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
          )}

          {material.content && (
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{material.content}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}