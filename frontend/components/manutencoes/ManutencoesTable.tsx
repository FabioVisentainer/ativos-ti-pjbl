import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { Empty } from "@/components/common/DataState";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Manutencao } from "@/lib/types";

export default function ManutencoesTable({ itens }: { itens: Manutencao[] }) {
  if (itens.length === 0) {
    return <Empty>Nenhuma manutenção encontrada.</Empty>;
  }

  const ordenadas = [...itens].sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <Table>
      <THead>
        <Th>Data</Th>
        <Th>Patrimônio</Th>
        <Th>Equipamento</Th>
        <Th>Tipo</Th>
        <Th>Descrição</Th>
        <Th align="right">Custo</Th>
      </THead>
      <tbody>
        {ordenadas.map((m) => (
          <Tr key={m.id}>
            <Td>{formatDate(m.data)}</Td>
            <Td strong>{m.numeroPatrimonio}</Td>
            <Td>{m.equipamento}</Td>
            <Td>{m.tipo}</Td>
            <Td muted>{m.descricao}</Td>
            <Td align="right">{formatCurrency(m.custo)}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
