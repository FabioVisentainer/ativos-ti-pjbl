import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import AuthGate from "@/components/layout/AuthGate";

export const metadata: Metadata = {
  title: "Ativos de TI",
  description: "Sistema de Controle de Ativos de Informática — projeto PJBL",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-[var(--bg)] text-[var(--text)]">
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
