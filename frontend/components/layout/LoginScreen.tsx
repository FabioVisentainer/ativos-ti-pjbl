"use client";

import { Laptop2, ShieldCheck, Info } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function LoginScreen() {
  const { entrar } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] bg-white">
        <div className="bg-gradient-to-br from-[var(--blue)] to-[var(--navy)] px-8 py-9 text-center text-white">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-4">
            <Laptop2 size={26} />
          </div>
          <h1 className="text-xl font-semibold">Controle de Ativos de TI</h1>
          <p className="text-sm text-white/80 mt-1">
            Uso interno — rede corporativa
          </p>
        </div>

        <div className="px-8 py-7">
          <p className="text-sm text-[var(--text-muted)] mb-6">
            O acesso é feito com a sua conta corporativa. O sistema não
            armazena senhas: a autenticação é delegada ao Microsoft Entra ID.
          </p>

          <button
            onClick={entrar}
            className="w-full flex items-center justify-center gap-2 bg-[var(--blue)] hover:bg-[#1c74c4] text-white font-medium text-sm py-3 rounded-lg transition-colors"
          >
            <ShieldCheck size={18} />
            Entrar com conta corporativa
          </button>

          <div className="mt-5 flex items-start gap-2 bg-[#e7f2fd] text-[#1c4e80] text-xs rounded-lg px-3 py-3">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              Sessão encerrada automaticamente após 30 minutos de
              inatividade.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
