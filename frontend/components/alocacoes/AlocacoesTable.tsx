import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import { Empty } from "@/components/common/DataState";
import { formatDate } from "@/lib/format";
import type { Alocacao } from "@/lib/types";

export default function AlocacoesTable({
  itens,
  onDevolver,
}: {
  itens: Alocacao[];
  onDevolver: (id: number) => void;
}) {
  if (itens.length === 0) {
    return <Empty>Nenhuma alocação ativa no momento.</Empty>;
  }

  return (
    <Table>
      <THead>
        <Th>Patrimônio</Th>
        <Th>Equipamento</Th>
        <Th>Colaborador</Th>
        <Th>Setor</Th>
        <Th>Retirada</Th>
        <Th>Ações</Th>
      </THead>
      <tbody>
        {itens.map((a) => (
          <Tr key={a.id}>
            <Td strong>{a.numeroPatrimonio}</Td>
            <Td>{a.equipamento}</Td>
            <Td>{a.colaborador}</Td>
            <Td>{a.setor}</Td>
            <Td muted>{formatDate(a.dataRetirada)}</Td>
            <Td>
              <Button variant="ghost" onClick={() => onDevolver(a.id)}>
                Devolver
              </Button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
