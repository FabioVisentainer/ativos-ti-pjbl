import Button from "./Button";

export default function Pagination({
  pagina,
  totalPaginas,
  totalRegistros,
  onChange,
}: {
  pagina: number;
  totalPaginas: number;
  totalRegistros: number;
  onChange: (novaPagina: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-[var(--text-muted)]">
      <span>
        Página {pagina} de {totalPaginas} · {totalRegistros} registros
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={pagina <= 1}
          onClick={() => onChange(pagina - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="secondary"
          disabled={pagina >= totalPaginas}
          onClick={() => onChange(pagina + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
