"use client";

import { useEffect, useState } from "react";
import { ArrowUpFromLine, ScanLine, Plus } from "lucide-react";
import { getAlocacoes } from "@/lib/api";
import type { Alocacao } from "@/lib/types";
import PageHeader from "@/components/common/PageHeader";
import InfoBanner from "@/components/common/InfoBanner";
import { Loading, ErrorMsg } from "@/components/common/DataState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AlocacoesTable from "@/components/alocacoes/AlocacoesTable";

export default function AlocacoesPage() {
  const [alocacoes, setAlocacoes] = useState<Alocacao[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devolvidas, setDevolvidas] = useState<Set<number>>(new Set());

  useEffect(() => {
    getAlocacoes()
      .then(setAlocacoes)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <ErrorMsg message={error} />;
  if (!alocacoes) return <Loading />;

  const ativas = alocacoes.filter((a) => !devolvidas.has(a.id));

  function devolver(id: number) {
    // Simula a devolução (RF22) apenas na sessão do navegador — sem
    // persistência, já que a API é mock/somente leitura (GET).
    setDevolvidas((prev) => new Set(prev).add(id));
  }

  return (
    <div>
      <PageHeader
        icon={ArrowUpFromLine}
        title="Alocações"
        subtitle="Equipamentos atualmente em posse de colaboradores."
        actions={
          <>
            <Button variant="secondary" icon={<ScanLine size={15} />}>
              Ler código
            </Button>
            <Button icon={<Plus size={15} />}>Nova Alocação</Button>
          </>
        }
      />

      <InfoBanner>
        Um ativo só pode estar alocado a um colaborador por vez. Ao registrar
        a devolução, o equipamento volta ao estoque e a movimentação fica no
        histórico.
      </InfoBanner>

      <Card padded={false}>
        <div className="px-4 py-3 border-b border-[var(--border)] text-sm text-[var(--text-muted)]">
          {ativas.length} alocações ativas
        </div>
        <AlocacoesTable itens={ativas} onDevolver={devolver} />
      </Card>
    </div>
  );
}
