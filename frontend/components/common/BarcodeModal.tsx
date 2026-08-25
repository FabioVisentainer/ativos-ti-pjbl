"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ScanLine, X, Camera } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function BarcodeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [codigo, setCodigo] = useState("");
  const router = useRouter();

  if (!open) return null;

  function buscar(e: FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) return;
    router.push(`/ativos/?busca=${encodeURIComponent(codigo.trim())}`);
    setCodigo("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-[var(--navy)]">
            <ScanLine size={20} />
            <h2 className="text-base font-semibold">Ler código</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-lg bg-[var(--bg)] border border-dashed border-[var(--border)] p-4 mb-4 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <Camera size={22} className="shrink-0" />
          <span>
            A leitura via câmera (RF19/RF20/RF26) depende da permissão de
            acesso concedida pelo navegador. Em produção, use
            <code className="mx-1">getUserMedia</code>
            para abrir a câmera. Aqui, digite o código manualmente.
          </span>
        </div>

        <form onSubmit={buscar} className="flex gap-2">
          <Input
            autoFocus
            type="text"
            placeholder="Ex.: PAT-0004"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="flex-1 bg-white"
          />
          <Button type="submit">Buscar</Button>
        </form>
      </div>
    </div>
  );
}
