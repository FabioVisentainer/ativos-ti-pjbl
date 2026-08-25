"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { getAtivos, getManutencoes } from "@/lib/api";
import { baixarCSV } from "@/lib/csv";
import type { Ativo, Manutencao } from "@/lib/types";
import PageHeader from "@/components/common/PageHeader";
import { Loading, ErrorMsg } from "@/components/common/DataState";
import RelatorioParametros, {
  TIPOS_RELATORIO,
  type TipoRelatorio,
} from "@/components/relatorios/RelatorioParametros";
import AtivosReportTable from "@/components/relatorios/AtivosReportTable";
import CustoPorTipoTable from "@/components/relatorios/CustoPorTipoTable";

export default function RelatoriosPage() {
  const [ativos, setAtivos] = useState<Ativo[] | null>(null);
  const [manutencoes, setManutencoes] = useState<Manutencao[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>(TIPOS_RELATORIO[0]);
  const [de, setDe] = useState("2026-01-01");
  const [ate, setAte] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    Promise.all([getAtivos(), getManutencoes()])
      .then(([a, m]) => {
        setAtivos(a);
        setManutencoes(m);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const porSetor = useMemo(() => {
    if (!ativos) return [];
    const grupos: Record<string, { setor: string; ativos: number; valor: number }> = {};
    for (const a of ativos) {
      if (!a.setor) continue;
      if (!grupos[a.setor]) grupos[a.setor] = { setor: a.setor, ativos: 0, valor: 0 };
      grupos[a.setor].ativos += 1;
      grupos[a.setor].valor += a.valorAquisicao;
    }
    return Object.values(grupos).sort((x, y) => y.ativos - x.ativos);
  }, [ativos]);

  const porStatus = useMemo(() => {
    if (!ativos) return [];
    const grupos: Record<string, number> = {};
    for (const a of ativos) grupos[a.status] = (grupos[a.status] || 0) + 1;
    return Object.entries(grupos).map(([status, quantidade]) => ({ status, quantidade }));
  }, [ativos]);

  const manutencoesNoPeriodo = useMemo(() => {
    if (!manutencoes) return [];
    return manutencoes.filter((m) => m.data >= de && m.data <= ate);
  }, [manutencoes, de, ate]);

  const custoPorTipo = useMemo(() => {
    const grupos: Record<string, { tipo: string; servicos: number; custo: number }> = {};
    for (const m of manutencoesNoPeriodo) {
      if (!grupos[m.tipo]) grupos[m.tipo] = { tipo: m.tipo, servicos: 0, custo: 0 };
      grupos[m.tipo].servicos += 1;
      grupos[m.tipo].custo += m.custo;
    }
    return Object.values(grupos);
  }, [manutencoesNoPeriodo]);

  if (error) return <ErrorMsg message={error} />;
  if (!ativos || !manutencoes) return <Loading />;

  function exportarCSV() {
    if (tipoRelatorio === "Ativos por status") {
      baixarCSV(
        "ativos-por-status.csv",
        ["Status", "Quantidade"],
        porStatus.map((s) => [s.status, s.quantidade])
      );
    } else if (tipoRelatorio === "Ativos alocados por colaborador/setor") {
      baixarCSV(
        "ativos-por-setor.csv",
        ["Setor", "Ativos", "Valor de aquisição"],
        porSetor.map((s) => [s.setor, s.ativos, s.valor.toFixed(2)])
      );
    } else {
      baixarCSV(
        "custo-manutencao-por-tipo.csv",
        ["Tipo", "Serviços", "Custo"],
        custoPorTipo.map((c) => [c.tipo, c.servicos, c.custo.toFixed(2)])
      );
    }
  }

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Relatórios"
        subtitle="Extrações consolidadas para análise e prestação de contas."
      />

      <RelatorioParametros
        tipoRelatorio={tipoRelatorio}
        onTipoChange={setTipoRelatorio}
        de={de}
        onDeChange={setDe}
        ate={ate}
        onAteChange={setAte}
        onExportarCSV={exportarCSV}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AtivosReportTable
          modo={tipoRelatorio === "Ativos por status" ? "status" : "setor"}
          porStatus={porStatus}
          porSetor={porSetor}
        />
        <CustoPorTipoTable itens={custoPorTipo} />
      </div>
    </div>
  );
}
