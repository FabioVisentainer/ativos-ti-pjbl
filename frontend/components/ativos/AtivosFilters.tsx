import Input from "@/components/ui/Input";
import type { StatusAtivo } from "@/lib/types";

const FILTROS: Array<StatusAtivo | "Todos"> = [
  "Todos",
  "Em estoque",
  "Em uso",
  "Em manutenção",
  "Baixado",
];

export default function AtivosFilters({
  busca,
  onBuscaChange,
  filtro,
  onFiltroChange,
}: {
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtro: StatusAtivo | "Todos";
  onFiltroChange: (valor: StatusAtivo | "Todos") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 flex-wrap border-b border-[var(--border)]">
      <Input
        type="text"
        placeholder="Pesquisar por patrimônio, série, modelo ou colaborador…"
        value={busca}
        onChange={(e) => onBuscaChange(e.target.value)}
        className="flex-1 min-w-[260px]"
      />
      <div className="flex gap-1.5 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => onFiltroChange(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
              filtro === f
                ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                : "bg-white text-[var(--text-muted)] border-[var(--border)] hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
