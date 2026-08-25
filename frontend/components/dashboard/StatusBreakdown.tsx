import Card from "@/components/ui/Card";
import type { StatusAtivo } from "@/lib/types";

const STATUS_COLORS: Record<StatusAtivo, string> = {
  "Em uso": "bg-[var(--success)]",
  "Em estoque": "bg-[var(--blue)]",
  "Em manutenção": "bg-[var(--warning)]",
  Baixado: "bg-[var(--danger)]",
};

interface StatusItem {
  label: StatusAtivo;
  valor: number;
}

export default function StatusBreakdown({ items }: { items: StatusItem[] }) {
  const max = Math.max(...items.map((s) => s.valor), 1);

  return (
    <Card>
      <h2 className="text-base font-semibold mb-5">Ativos por status</h2>
      <div className="flex flex-col gap-4">
        {items.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span>{s.label}</span>
              <span className="font-semibold">{s.valor}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg)] overflow-hidden">
              <div
                className={`h-full rounded-full ${STATUS_COLORS[s.label]}`}
                style={{ width: `${(s.valor / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
