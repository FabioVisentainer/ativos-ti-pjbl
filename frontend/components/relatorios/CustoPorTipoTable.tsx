import Card from "@/components/ui/Card";
import { Table, THead, Th, Tr, Td } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/format";

export interface CustoPorTipoRow {
  tipo: string;
  servicos: number;
  custo: number;
}

export default function CustoPorTipoTable({ itens }: { itens: CustoPorTipoRow[] }) {
  return (
    <Card>
      <h2 className="text-base font-semibold mb-4">
        Custo de manutenção por tipo (no período)
      </h2>
      {itens.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-4">
          Nenhuma manutenção no período selecionado.
        </p>
      ) : (
        <Table>
          <THead>
            <Th>Tipo</Th>
            <Th align="right">Serviços</Th>
            <Th align="right">Custo</Th>
          </THead>
          <tbody>
            {itens.map((c) => (
              <Tr key={c.tipo}>
                <Td>{c.tipo}</Td>
                <Td align="right">{c.servicos}</Td>
                <Td align="right">{formatCurrency(c.custo)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
