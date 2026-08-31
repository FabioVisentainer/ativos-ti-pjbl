"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Package, ScanLine, Plus } from "lucide-react";
import { getAtivos, inserirAtivo, alterarAtivo, excluirAtivo } from "@/lib/api";
import type { Ativo, NovoAtivo, StatusAtivo } from "@/lib/types";
import PageHeader from "@/components/common/PageHeader";
import InfoBanner from "@/components/common/InfoBanner";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Loading, ErrorMsg } from "@/components/common/DataState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import AtivosFilters from "@/components/ativos/AtivosFilters";
import AtivosTable from "@/components/ativos/AtivosTable";
import AtivoFormModal from "@/components/ativos/AtivoFormModal";

const POR_PAGINA = 8;

export default function AtivosPage() {
  const [ativos, setAtivos] = useState<Ativo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<StatusAtivo | "Todos">("Todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const [modal, setModal] = useState<{ aberto: boolean; ativo: Ativo | null }>({
    aberto: false,
    ativo: null,
  });
  const [paraExcluir, setParaExcluir] = useState<Ativo | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [acaoErro, setAcaoErro] = useState<string | null>(null);

  const carregarAtivos = useCallback(() => {
    return getAtivos()
      .then(setAtivos)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    carregarAtivos();

    // Preenche a busca a partir do modal "Ler código" (?busca=PAT-000X).
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("busca");
    if (codigo) setBusca(codigo);
  }, [carregarAtivos]);

  async function salvarAtivo(valores: NovoAtivo) {
    if (modal.ativo) {
      await alterarAtivo(modal.ativo.numeroPatrimonio, valores);
    } else {
      await inserirAtivo(valores);
    }
    setModal({ aberto: false, ativo: null });
    // Foca a busca no ativo salvo, pra ele aparecer na tela mesmo se cair
    // numa página diferente da paginação (ex.: um ativo recém-criado).
    setBusca(valores.numeroPatrimonio);
    setFiltro("Todos");
    setPagina(1);
    await carregarAtivos();
  }

  async function confirmarExclusao() {
    if (!paraExcluir) return;
    setExcluindo(true);
    setAcaoErro(null);
    try {
      await excluirAtivo(paraExcluir.numeroPatrimonio);
      setParaExcluir(null);
      await carregarAtivos();
    } catch (err) {
      setAcaoErro(err instanceof Error ? err.message : "Não foi possível excluir o ativo.");
    } finally {
      setExcluindo(false);
    }
  }

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
            <Button
              icon={<Plus size={15} />}
              onClick={() => setModal({ aberto: true, ativo: null })}
            >
              Novo Ativo
            </Button>
          </>
        }
      />

      <InfoBanner>
        Cada ativo tem um número de patrimônio único. O status é controlado
        pelo sistema: um ativo alocado não pode receber baixa, e um ativo em
        manutenção não pode ser alocado.
      </InfoBanner>

      {acaoErro && <ErrorMsg message={acaoErro} />}

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

        <AtivosTable
          itens={visiveis}
          onEditar={(ativo) => setModal({ aberto: true, ativo })}
          onExcluir={(ativo) => {
            setAcaoErro(null);
            setParaExcluir(ativo);
          }}
        />

        <Pagination
          pagina={paginaAtual}
          totalPaginas={totalPaginas}
          totalRegistros={filtrados.length}
          onChange={setPagina}
        />
      </Card>

      <AtivoFormModal
        // Remonta a cada abertura (nova ou de um ativo diferente) pra nunca
        // herdar estado de salvamento/erro de uma edição anterior.
        key={modal.aberto ? modal.ativo?.numeroPatrimonio ?? "novo-ativo" : "fechado"}
        open={modal.aberto}
        ativo={modal.ativo}
        onClose={() => setModal({ aberto: false, ativo: null })}
        onSubmit={salvarAtivo}
      />

      <ConfirmDialog
        open={paraExcluir !== null}
        title="Excluir ativo"
        description={
          paraExcluir
            ? `Tem certeza que deseja excluir o ativo ${paraExcluir.numeroPatrimonio} (${paraExcluir.tipo})? Essa ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        loading={excluindo}
        onConfirm={confirmarExclusao}
        onCancel={() => setParaExcluir(null)}
      />
    </div>
  );
}
