"use client";

import { useState, FormEvent } from "react";
import { X, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Ativo, NovoAtivo, StatusAtivo } from "@/lib/types";

const STATUS_OPCOES: StatusAtivo[] = ["Em estoque", "Em uso", "Em manutenção", "Baixado"];

type FormValues = Omit<NovoAtivo, "valorAquisicao"> & { valorAquisicao: string };

function valoresIniciais(ativo: Ativo | null): FormValues {
  if (ativo) {
    return {
      tipo: ativo.tipo,
      marca: ativo.marca,
      modelo: ativo.modelo,
      numeroPatrimonio: ativo.numeroPatrimonio,
      numeroSerie: ativo.numeroSerie,
      status: ativo.status,
      colaborador: ativo.colaborador,
      setor: ativo.setor,
      dataAquisicao: ativo.dataAquisicao,
      valorAquisicao: String(ativo.valorAquisicao),
    };
  }
  return {
    tipo: "",
    marca: "",
    modelo: "",
    numeroPatrimonio: "",
    numeroSerie: "",
    status: "Em estoque",
    colaborador: null,
    setor: null,
    dataAquisicao: new Date().toISOString().slice(0, 10),
    valorAquisicao: "",
  };
}

export default function AtivoFormModal({
  open,
  ativo,
  onClose,
  onSubmit,
}: {
  open: boolean;
  /** null = criando um novo ativo; um Ativo = editando esse ativo. */
  ativo: Ativo | null;
  onClose: () => void;
  onSubmit: (valores: NovoAtivo) => Promise<void>;
}) {
  const [valores, setValores] = useState<FormValues>(() => valoresIniciais(ativo));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!open) return null;

  const editando = ativo !== null;

  function campo<K extends keyof FormValues>(chave: K, valor: FormValues[K]) {
    setValores((v) => ({ ...v, [chave]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!valores.numeroPatrimonio.trim() || !valores.tipo.trim()) {
      setErro("Preencha ao menos o número de patrimônio e o tipo.");
      return;
    }

    setSalvando(true);
    try {
      await onSubmit({
        ...valores,
        valorAquisicao: Number(valores.valorAquisicao) || 0,
      });
      // Sucesso: o pai fecha o modal (via `open`); ainda assim garantimos que
      // este componente não fique "preso" em estado de salvando, caso ele
      // seja reaberto sem ser remontado.
      setSalvando(false);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar o ativo.");
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--navy)]">
            {editando ? `Editar ativo — ${ativo.numeroPatrimonio}` : "Novo ativo"}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text)]"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-xs text-[var(--text-muted)]">
            Número de patrimônio
            <Input
              className="w-full mt-1"
              value={valores.numeroPatrimonio}
              disabled={editando}
              onChange={(e) => campo("numeroPatrimonio", e.target.value)}
              placeholder="PAT-0015"
              required
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Tipo
            <Input
              className="w-full mt-1"
              value={valores.tipo}
              onChange={(e) => campo("tipo", e.target.value)}
              placeholder="Notebook"
              required
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Status
            <Select
              className="w-full mt-1"
              value={valores.status}
              onChange={(e) => campo("status", e.target.value as StatusAtivo)}
            >
              {STATUS_OPCOES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Marca
            <Input
              className="w-full mt-1"
              value={valores.marca}
              onChange={(e) => campo("marca", e.target.value)}
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Modelo
            <Input
              className="w-full mt-1"
              value={valores.modelo}
              onChange={(e) => campo("modelo", e.target.value)}
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Número de série
            <Input
              className="w-full mt-1"
              value={valores.numeroSerie}
              onChange={(e) => campo("numeroSerie", e.target.value)}
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Data de aquisição
            <Input
              type="date"
              className="w-full mt-1"
              value={valores.dataAquisicao}
              onChange={(e) => campo("dataAquisicao", e.target.value)}
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Colaborador
            <Input
              className="w-full mt-1"
              value={valores.colaborador ?? ""}
              onChange={(e) => campo("colaborador", e.target.value || null)}
              placeholder="—"
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Setor
            <Input
              className="w-full mt-1"
              value={valores.setor ?? ""}
              onChange={(e) => campo("setor", e.target.value || null)}
              placeholder="—"
            />
          </label>

          <label className="text-xs text-[var(--text-muted)]">
            Valor de aquisição (R$)
            <Input
              type="number"
              step="0.01"
              min="0"
              className="w-full mt-1"
              value={valores.valorAquisicao}
              onChange={(e) => campo("valorAquisicao", e.target.value)}
            />
          </label>

          {erro && (
            <p className="col-span-2 text-xs text-[var(--danger)] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" icon={<Save size={15} />} disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
