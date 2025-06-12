// File: src/app/login/page.js (Dengan Isian Kelas)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('siswa');
  const [kelas, setKelas] = useState(''); // <-- State baru untuk kelas
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);
    setMessage('');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          kelas: role === 'siswa' ? kelas : null, // <-- Kirim data kelas jika peran siswa
        },
      },
    });

    if (authError) {
      setMessage('Error: ' + authError.message);
    } else if (authData.user) {
        // Trigger akan otomatis membuat profil. Kita hanya perlu memberi pesan.
        setMessage('Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi.');
    }
    setIsSubmitting(false);
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      router.push('/');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Login / Register</h1>
        <div className="space-y-4">
          <input type="text" placeholder="Nama Lengkap" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-md">
            <option value="siswa">Saya adalah seorang Siswa</option>
            <option value="guru">Saya adalah seorang Guru</option>
          </select>

          {/* Form Kelas hanya muncul jika peran adalah siswa */}
          {role === 'siswa' && (
            <input type="text" placeholder="Kelas (Contoh: 7A, 8B)" value={kelas} onChange={e => setKelas(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          )}

          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
          <div className="flex gap-4">
            <button onClick={handleLogin} disabled={isSubmitting} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400">Login</button>
            <button onClick={handleRegister} disabled={isSubmitting} className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">Register</button>
          </div>
          {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
        </div>
      </div>
    </main>
  );
}