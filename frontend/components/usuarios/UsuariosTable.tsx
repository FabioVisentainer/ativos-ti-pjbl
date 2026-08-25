import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import type { Usuario } from "@/lib/types";

export default function UsuariosTable({ itens }: { itens: Usuario[] }) {
  return (
    <Table>
      <THead>
        <Th>Nome</Th>
        <Th>Conta corporativa</Th>
        <Th>Perfil</Th>
        <Th>Último acesso</Th>
        <Th>Situação</Th>
      </THead>
      <tbody>
        {itens.map((u) => (
          <Tr key={u.id}>
            <Td strong>{u.nome}</Td>
            <Td muted>{u.contaCorporativa}</Td>
            <Td>{u.perfil}</Td>
            <Td muted>{formatDateTime(u.ultimoAcesso)}</Td>
            <Td>
              <Badge status={u.situacao} />
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
