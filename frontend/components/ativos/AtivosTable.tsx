import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { Empty } from "@/components/common/DataState";
import type { Ativo } from "@/lib/types";

export default function AtivosTable({ itens }: { itens: Ativo[] }) {
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
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
