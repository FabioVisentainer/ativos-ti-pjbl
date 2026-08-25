"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, ScanLine, Plus } from "lucide-react";
import { getAtivos } from "@/lib/api";
import type { Ativo, StatusAtivo } from "@/lib/types";
import PageHeader from "@/components/common/PageHeader";
import InfoBanner from "@/components/common/InfoBanner";
import { Loading, ErrorMsg } from "@/components/common/DataState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import AtivosFilters from "@/components/ativos/AtivosFilters";
import AtivosTable from "@/components/ativos/AtivosTable";

const POR_PAGINA = 8;

export default function AtivosPage() {
  const [ativos, setAtivos] = useState<Ativo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<StatusAtivo | "Todos">("Todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    getAtivos()
      .then(setAtivos)
      .catch((err: Error) => setError(err.message));

    // Preenche a busca a partir do modal "Ler código" (?busca=PAT-000X).
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("busca");
    if (codigo) setBusca(codigo);
  }, []);

  const filtrados = useMemo(() => {
    if (!ativos) return [];
    const termo = busca.trim().toLowerCase();
    return ativos.filter((a) => {
      const passaStatus = filtro === "Todos" || a.status === filtro;
      const passaBusca =
        termo === "" ||
        [a.numeroPatrimonio, a.numeroSerie, a.tipo, a.marca, a.modelo, a.colaborador]
          .filter((campo): campo is string => Boolean(campo))
          .some((campo) => campo.toLowerCase().includes(termo));
      return passaStatus && passaBusca;
    });
  }, [ativos, filtro, busca]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA
  );

  if (error) return <ErrorMsg message={error} />;
  if (!ativos) return <Loading />;

  return (
    <div>
      <PageHeader
        icon={Package}
        title="Ativos"
        subtitle="Todo o parque de equipamentos, do cadastro à baixa."
        actions={
          <>
            <Button variant="secondary" icon={<ScanLine size={15} />}>
              Consultar por código
            </Button>
            <Button icon={<Plus size={15} />}>Novo Ativo</Button>
          </>
        }
      />

      <InfoBanner>
        Cada ativo tem um número de patrimônio único. O status é controlado
        pelo sistema: um ativo alocado não pode receber baixa, e um ativo em
        manutenção não pode ser alocado.
      </InfoBanner>

      <Card padded={false}>
        <AtivosFilters
          busca={busca}
          onBuscaChange={(v) => {
            setBusca(v);
            setPagina(1);
          }}
          filtro={filtro}
          onFiltroChange={(v) => {
            setFiltro(v);
            setPagina(1);
          }}
        />

        <AtivosTable itens={visiveis} />

        <Pagination
          pagina={paginaAtual}
          totalPaginas={totalPaginas}
          totalRegistros={filtrados.length}
          onChange={setPagina}
        />
      </Card>
    </div>
  );
}
