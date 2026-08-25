import Card from "@/components/ui/Card";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";

interface Permissao {
  acao: string;
  colaborador: boolean;
  tecnico: boolean;
  gestor: boolean;
}

const MATRIZ: Permissao[] = [
  { acao: "Consultar ativos", colaborador: true, tecnico: true, gestor: true },
  { acao: "Cadastrar e editar ativos", colaborador: false, tecnico: true, gestor: true },
  { acao: "Alocar e registrar devolução", colaborador: false, tecnico: true, gestor: true },
  { acao: "Registrar manutenção e custos", colaborador: false, tecnico: true, gestor: true },
  { acao: "Dar baixa em ativo", colaborador: false, tecnico: false, gestor: true },
  { acao: "Gerenciar usuários e permissões", colaborador: false, tecnico: false, gestor: true },
];

function Sim({ v }: { v: boolean }) {
  return (
    <span className={v ? "text-[var(--success)] font-medium" : "text-[var(--text-muted)]"}>
      {v ? "Sim" : "Não"}
    </span>
  );
}

export default function PermissoesMatrix() {
  return (
    <Card>
      <h2 className="text-base font-semibold mb-4">Matriz de permissões</h2>
      <Table>
        <THead>
          <Th>Ação</Th>
          <Th>Colaborador</Th>
          <Th>Técnico de TI</Th>
          <Th>Gestor de TI</Th>
        </THead>
        <tbody>
          {MATRIZ.map((m) => (
            <Tr key={m.acao}>
              <Td>{m.acao}</Td>
              <Td>
                <Sim v={m.colaborador} />
              </Td>
              <Td>
                <Sim v={m.tecnico} />
              </Td>
              <Td>
                <Sim v={m.gestor} />
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
