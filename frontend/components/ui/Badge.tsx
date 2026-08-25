import type { StatusAtivo, SituacaoPessoa } from "@/lib/types";

type BadgeValue = StatusAtivo | SituacaoPessoa | string;

const STYLES: Record<string, string> = {
  "Em uso": "bg-[#e3f6ea] text-[var(--success)]",
  "Em estoque": "bg-[#dceafd] text-[var(--blue)]",
  "Em manutenção": "bg-[#fbf0d9] text-[var(--warning)]",
  Baixado: "bg-[#fbe4e1] text-[var(--danger)]",
  Ativo: "bg-[#e3f6ea] text-[var(--success)]",
  Inativo: "bg-gray-100 text-gray-500",
};

export default function Badge({ status }: { status: BadgeValue }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}
