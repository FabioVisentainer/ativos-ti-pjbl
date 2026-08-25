"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import BarcodeModal from "@/components/common/BarcodeModal";

export default function Topbar() {
  const { usuario } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <header className="bg-[var(--topbar)] text-white px-6 py-3 flex items-center justify-between">
        <span className="text-sm font-medium">
          Sistema de Controle de Ativos de Informática
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 text-xs font-medium border border-white/30 rounded-lg px-3 py-1.5 hover:bg-white/10"
          >
            <ScanLine size={14} />
            Ler código
          </button>

          <div className="flex items-center gap-2.5">
            <div className="text-right leading-tight">
              <div className="text-xs font-semibold">{usuario.nome}</div>
              <div className="text-[11px] text-white/70">{usuario.perfil}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
              {usuario.iniciais}
            </div>
          </div>
        </div>
      </header>

      <BarcodeModal open={modalAberto} onClose={() => setModalAberto(false)} />
    </>
  );
}
