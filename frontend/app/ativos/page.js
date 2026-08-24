"use client";

import { useEffect, useMemo, useState } from "react";
import { getAtivos } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function AtivosPage() {
  const [ativos, setAtivos] = useState(null);
  const [error, setError] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    getAtivos()
      .then(setAtivos)
      .catch((err) => setError(err.message));
  }, []);

  const statusDisponiveis = useMemo(() => {
    if (!ativos) return [];
    return ["Todos", ...new Set(ativos.map((a) => a.status))];
  }, [ativos]);

  const ativosFiltrados = useMemo(() => {
    if (!ativos) return [];
    return ativos.filter((ativo) => {
      const passaStatus = statusFiltro === "Todos" || ativo.status === statusFiltro;
      const termo = busca.trim().toLowerCase();
      const passaBusca =
        termo === "" ||
        ativo.tipo.toLowerCase().includes(termo) ||
        ativo.marca.toLowerCase().includes(termo) ||
        ativo.modelo.toLowerCase().includes(termo) ||
        ativo.numeroPatrimonio.toLowerCase().includes(termo) ||
        (ativo.colaborador ?? "").toLowerCase().includes(termo);
      return passaStatus && passaBusca;
    });
  }, [ativos, statusFiltro, busca]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Ativos de TI</h1>
      <p className="text-sm text-[var(--text-muted)] mb-7">
        Cadastro e consulta de ativos, com filtro por status e busca (RF17).
        Dados consumidos via <code>GET /api/ativos</code>.
      </p>

      {error && (
        <p className="text-sm text-[var(--danger)] py-6">
          Não foi possível carregar os ativos: {error}
        </p>
      )}

      {!ativos && !error && (
        <p className="text-sm text-[var(--text-muted)] py-6">Carregando…</p>
      )}

      {ativos && (
        <>
          <div className="flex gap-3 mb-5 flex-wrap">
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-white"
            >
              {statusDisponiveis.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Buscar por tipo, marca, patrimônio, colaborador…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-white flex-1 min-w-[240px]"
            />
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[10px] p-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="pb-2 pr-4">Patrimônio</th>
                  <th className="pb-2 pr-4">Tipo</th>
                  <th className="pb-2 pr-4">Marca / Modelo</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Colaborador</th>
                  <th className="pb-2">Setor</th>
                </tr>
              </thead>
              <tbody>
                {ativosFiltrados.map((ativo) => (
                  <tr key={ativo.id} className="border-t border-[var(--border)]">
                    <td className="py-2.5 pr-4 font-medium">
                      {ativo.numeroPatrimonio}
                    </td>
                    <td className="py-2.5 pr-4">{ativo.tipo}</td>
                    <td className="py-2.5 pr-4">
                      {ativo.marca} {ativo.modelo}
                    </td>
                    <td className="py-2.5 pr-4">
                      <StatusBadge status={ativo.status} />
                    </td>
                    <td className="py-2.5 pr-4">{ativo.colaborador ?? "—"}</td>
                    <td className="py-2.5">{ativo.setor ?? "—"}</td>
                  </tr>
                ))}
                {ativosFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-[var(--text-muted)]"
                    >
                      Nenhum ativo encontrado para os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
