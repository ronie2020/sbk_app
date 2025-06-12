// File: src/app/layout.js (Versi Rapi)

import { Inter } from "next/font/google";
import "./globals.css";
import MenuUtama from "@/components/MenuUtama"; // Pastikan import ini 'N' besar
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Netila Interaktif Sistem",
  description: "Website pembelajaran interaktif Seni Budaya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <AuthProvider>
          <MenuUtama />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}