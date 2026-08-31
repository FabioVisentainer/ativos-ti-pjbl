import { Pencil, Trash2 } from "lucide-react";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { Empty } from "@/components/common/DataState";
import type { Ativo } from "@/lib/types";

export default function AtivosTable({
  itens,
  onEditar,
  onExcluir,
}: {
  itens: Ativo[];
  onEditar: (ativo: Ativo) => void;
  onExcluir: (ativo: Ativo) => void;
}) {
  if (itens.length === 0) {
    return <Empty>Nenhum ativo encontrado para os filtros aplicados.</Empty>;
  }

  return (
    <Table>
      <THead>
        <Th>Patrimônio</Th>
        <Th>Tipo</Th>
        <Th>Marca / Modelo</Th>
        <Th>Nº de série</Th>
        <Th>Status</Th>
        <Th>Alocado para</Th>
        <Th>Ações</Th>
      </THead>
      <tbody>
        {itens.map((a) => (
          <Tr key={a.id}>
            <Td strong>{a.numeroPatrimonio}</Td>
            <Td>{a.tipo}</Td>
            <Td>
              {a.marca} {a.modelo}
            </Td>
            <Td muted>{a.numeroSerie}</Td>
            <Td>
              <Badge status={a.status} />
            </Td>
            <Td>{a.colaborador ?? "—"}</Td>
            <Td>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEditar(a)}
                  className="text-[var(--text-muted)] hover:text-[var(--blue)]"
                  aria-label={`Editar ${a.numeroPatrimonio}`}
                  title="Editar"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onExcluir(a)}
                  className="text-[var(--text-muted)] hover:text-[var(--danger)]"
                  aria-label={`Excluir ${a.numeroPatrimonio}`}
                  title="Excluir"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
