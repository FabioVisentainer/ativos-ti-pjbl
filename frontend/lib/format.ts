export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("pt-BR");
}

export function formatDateTime(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleString("pt-BR");
}
