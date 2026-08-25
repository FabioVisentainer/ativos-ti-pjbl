import { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`px-3 py-2 rounded-lg border border-[var(--border)] text-sm bg-[var(--bg)] ${className}`}
      {...rest}
    />
  );
}
