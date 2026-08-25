import { Download } from "lucide-react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const TIPOS_RELATORIO = [
  "Ativos por status",
  "Ativos alocados por colaborador/setor",
  "Custos de manutenção por período",
] as const;

export type TipoRelatorio = (typeof TIPOS_RELATORIO)[number];

export default function RelatorioParametros({
  tipoRelatorio,
  onTipoChange,
  de,
  onDeChange,
  ate,
  onAteChange,
  onExportarCSV,
}: {
  tipoRelatorio: TipoRelatorio;
  onTipoChange: (v: TipoRelatorio) => void;
  de: string;
  onDeChange: (v: string) => void;
  ate: string;
  onAteChange: (v: string) => void;
  onExportarCSV: () => void;
}) {
  return (
    <Card className="mb-6">
      <h2 className="text-base font-semibold mb-4">Parâmetros</h2>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[var(--text-muted)]">Relatório</span>
          <Select
            value={tipoRelatorio}
            onChange={(e) => onTipoChange(e.target.value as TipoRelatorio)}
            className="min-w-[280px]"
          >
            {TIPOS_RELATORIO.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[var(--text-muted)]">De</span>
          <Input type="date" value={de} onChange={(e) => onDeChange(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[var(--text-muted)]">Até</span>
          <Input type="date" value={ate} onChange={(e) => onAteChange(e.target.value)} />
        </label>
        <Button>Gerar</Button>
        <Button variant="secondary" icon={<Download size={15} />} onClick={onExportarCSV}>
          CSV
        </Button>
      </div>
    </Card>
  );
}
