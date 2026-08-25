import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[10px] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
