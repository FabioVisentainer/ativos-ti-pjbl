"use client";

import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 text-[var(--danger)]">
            <AlertTriangle size={20} />
            <h2 className="text-base font-semibold">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-[var(--text-muted)] mb-5">{description}</p>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="!bg-[var(--danger)] hover:!bg-red-700"
          >
            {loading ? "Excluindo…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
