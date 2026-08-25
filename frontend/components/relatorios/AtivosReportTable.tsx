import Card from "@/components/ui/Card";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/format";

export interface PorStatusRow {
  status: string;
  quantidade: number;
}

export interface PorSetorRow {
  setor: string;
  ativos: number;
  valor: number;
}

export default function AtivosReportTable({
  modo,
  porStatus,
  porSetor,
}: {
  modo: "status" | "setor";
  porStatus: PorStatusRow[];
  porSetor: PorSetorRow[];
}) {
  return (
    <Card>
      <h2 className="text-base font-semibold mb-4">
        {modo === "status" ? "Ativos por status" : "Ativos alocados por setor"}
      </h2>
      {modo === "status" ? (
        <Table>
          <THead>
            <Th>Status</Th>
            <Th align="right">Ativos</Th>
          </THead>
          <tbody>
            {porStatus.map((s) => (
              <Tr key={s.status}>
                <Td>{s.status}</Td>
                <Td align="right">{s.quantidade}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Table>
          <THead>
            <Th>Setor</Th>
            <Th align="right">Ativos</Th>
            <Th align="right">Valor de aquisição</Th>
          </THead>
          <tbody>
            {porSetor.map((s) => (
              <Tr key={s.setor}>
                <Td>{s.setor}</Td>
                <Td align="right">{s.ativos}</Td>
                <Td align="right">{formatCurrency(s.valor)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
