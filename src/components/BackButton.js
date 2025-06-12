// File: src/components/BackButton.js
'use client'; // <-- Tandai sebagai Client Component agar bisa interaktif

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()} // <-- Perintah untuk kembali ke halaman sebelumnya
      className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
    >
      &larr; Kembali ke Daftar Materi
    </button>
  );
}