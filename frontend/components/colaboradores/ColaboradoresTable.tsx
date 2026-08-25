import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import type { Colaborador } from "@/lib/types";

export default function ColaboradoresTable({ itens }: { itens: Colaborador[] }) {
  return (
    <Table>
      <THead>
        <Th>Nome</Th>
        <Th>Matrícula</Th>
        <Th>Setor</Th>
        <Th>Ativos alocados</Th>
        <Th>Situação</Th>
      </THead>
      <tbody>
        {itens.map((c) => (
          <Tr key={c.id}>
            <Td strong>{c.nome}</Td>
            <Td muted>{c.matricula}</Td>
            <Td>{c.setor}</Td>
            <Td>{c.ativosAlocados}</Td>
            <Td>
              <Badge status={c.situacao} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
