// File: src/context/AuthContext.js (Versi Lebih Tahan Banting)

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log("Mencoba mengambil sesi awal...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Sesi ditemukan, mengambil profil...");
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser({ ...session.user, profile });
          console.log("Profil ditemukan, user di-set:", { ...session.user, profile });
        } else {
          setUser(null);
          console.log("Tidak ada sesi, user di-set ke null.");
        }
      } catch (error) {
        console.error("Error saat mengambil sesi awal:", error);
        setUser(null);
      } finally {
        // 'finally' akan selalu dijalankan, baik ada error maupun tidak.
        // Ini memastikan loading selalu berhenti.
        setLoading(false);
        console.log("Proses loading awal selesai.");
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Event auth terdeteksi:", event);
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser({ ...session.user, profile });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};