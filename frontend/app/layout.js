import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Ativos de TI",
  description:
    "Sistema de Controle de Ativos de Informática — projeto PJBL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex bg-[var(--bg)] text-[var(--text)]">
        <Sidebar />
        <main className="flex-1 px-10 py-8 max-w-5xl">{children}</main>
      </body>
    </html>
  );
}
