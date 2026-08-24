"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-[var(--text-muted)] mb-7">
        Indicadores gerenciais do parque de ativos de TI (RF35). Dados
        consumidos via <code>GET /api/dashboard</code>.
      </p>

      {error && (
        <p className="text-sm text-[var(--danger)] py-6">
          Não foi possível carregar os indicadores: {error}
        </p>
      )}

      {!data && !error && (
        <p className="text-sm text-[var(--text-muted)] py-6">Carregando…</p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total de ativos" value={data.totalAtivos} />
            <StatCard label="Em uso" value={data.emUso} />
            <StatCard label="Em manutenção" value={data.emManutencao} />
            <StatCard label="Baixados" value={data.baixados} />
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[10px] p-5 mb-6">
            <h2 className="text-base font-semibold mb-4">
              Custo de manutenção acumulado
            </h2>
            <p className="text-2xl font-bold text-[var(--navy)]">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(data.custoManutencaoAcumulado)}
            </p>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-[10px] p-5">
            <h2 className="text-base font-semibold mb-4">Ativos por setor</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="pb-2">Setor</th>
                  <th className="pb-2">Ativos alocados</th>
                </tr>
              </thead>
              <tbody>
                {data.ativosPorSetor.map((row) => (
                  <tr key={row.setor} className="border-t border-[var(--border)]">
                    <td className="py-2.5">{row.setor}</td>
                    <td className="py-2.5">{row.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
