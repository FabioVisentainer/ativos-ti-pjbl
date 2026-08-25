import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-muted)] bg-[var(--bg)]">
        {children}
      </tr>
    </thead>
  );
}

export function Th({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th className={`px-4 py-2.5 ${align === "right" ? "text-right" : ""}`}>
      {children}
    </th>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-t border-[var(--border)]">{children}</tr>;
}

export function Td({
  children,
  align = "left",
  muted = false,
  strong = false,
}: {
  children: ReactNode;
  align?: "left" | "right";
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <td
      className={`px-4 py-2.5 ${align === "right" ? "text-right" : ""} ${
        muted ? "text-[var(--text-muted)]" : ""
      } ${strong ? "font-medium" : ""}`}
    >
      {children}
    </td>
  );
}
