import { SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-white ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
