import Card from "@/components/ui/Card";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { formatDate } from "@/lib/format";
import type { Movimentacao } from "@/lib/types";

export default function MovimentacoesTable({ itens = [] }: { itens?: Movimentacao[] }) {
  if (itens.length === 0) {
    return (
      <Card>
        <h2 className="text-base font-semibold mb-4">Últimas movimentações</h2>
        <p className="text-sm text-[var(--text-muted)]">Nenhuma movimentação registrada.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-base font-semibold mb-4">Últimas movimentações</h2>
      <Table>
        <THead>
          <Th>Data</Th>
          <Th>Ativo</Th>
          <Th>Operação</Th>
          <Th>Colaborador</Th>
          <Th>Registrado por</Th>
        </THead>
        <tbody>
          {itens.map((m) => (
            <Tr key={m.id}>
              <Td>{formatDate(m.data)}</Td>
              <Td>
                {m.numeroPatrimonio} · {m.ativo}
              </Td>
              <Td>{m.operacao}</Td>
              <Td>{m.colaborador ?? "—"}</Td>
              <Td muted>{m.registradoPor}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
