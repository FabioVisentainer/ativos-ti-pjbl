type CsvCell = string | number;

function toCSV(headers: string[], rows: CsvCell[][]): string {
  const escape = (v: CsvCell) => `"${String(v).replace(/"/g, '""')}"`;
  const linhas = [headers.map(escape).join(";")];
  for (const row of rows) linhas.push(row.map(escape).join(";"));
  return linhas.join("\n");
}

export function baixarCSV(
  nomeArquivo: string,
  headers: string[],
  rows: CsvCell[][]
): void {
  const csv = toCSV(headers, rows);
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
