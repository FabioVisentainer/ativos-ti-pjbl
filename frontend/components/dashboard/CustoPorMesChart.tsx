import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import type { CustoPorMes } from "@/lib/types";

export default function CustoPorMesChart({ dados }: { dados: CustoPorMes[] }) {
  const max = Math.max(...dados.map((m) => m.valor), 1);

  return (
    <Card>
      <h2 className="text-base font-semibold mb-5">Custo de manutenção por mês</h2>
      <div className="flex items-stretch gap-3 h-36">
        {dados.map((m) => (
          <div
            key={m.mes}
            className="flex-1 h-full flex flex-col justify-end items-center gap-2"
          >
            <div
              className="w-full rounded-t-md bg-[var(--blue)]"
              style={{ height: `${Math.max((m.valor / max) * 100, 3)}%` }}
              title={formatCurrency(m.valor)}
            />
            <span className="text-xs text-[var(--text-muted)] shrink-0">{m.mes}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
