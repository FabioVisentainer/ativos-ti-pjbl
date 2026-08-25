import { ReactNode } from "react";

export function Loading() {
  return <p className="text-sm text-[var(--text-muted)] py-10">Carregando…</p>;
}

export function ErrorMsg({ message }: { message: string }) {
  return (
    <p className="text-sm text-[var(--danger)] py-10">
      Não foi possível carregar os dados: {message}
    </p>
  );
}

export function Empty({ children }: { children?: ReactNode }) {
  return (
    <div className="py-10 text-center text-sm text-[var(--text-muted)]">
      {children ?? "Nenhum registro encontrado."}
    </div>
  );
}
