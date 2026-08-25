"use client";

import { useEffect, useState } from "react";
import { Users, Plus } from "lucide-react";
import { getColaboradores } from "@/lib/api";
import type { Colaborador } from "@/lib/types";
import PageHeader from "@/components/common/PageHeader";
import InfoBanner from "@/components/common/InfoBanner";
import { Loading, ErrorMsg } from "@/components/common/DataState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ColaboradoresTable from "@/components/colaboradores/ColaboradoresTable";

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getColaboradores()
      .then(setColaboradores)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <ErrorMsg message={error} />;
  if (!colaboradores) return <Loading />;

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Colaboradores"
        subtitle="Pessoas da empresa que podem receber equipamentos."
        actions={<Button icon={<Plus size={15} />}>Novo Colaborador</Button>}
      />

      <InfoBanner>
        Colaboradores com ativos alocados não podem ser inativados. Devolva
        os equipamentos antes de encerrar o registro.
      </InfoBanner>

      <Card padded={false}>
        <div className="px-4 py-3 border-b border-[var(--border)] text-sm text-[var(--text-muted)]">
          {colaboradores.length} registros
        </div>
        <ColaboradoresTable itens={colaboradores} />
      </Card>
    </div>
  );
}
