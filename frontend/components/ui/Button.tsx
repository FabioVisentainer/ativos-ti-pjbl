import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-[var(--blue)] text-white hover:bg-[#1c5fb8] border border-[var(--blue)]",
  secondary:
    "bg-white text-[var(--text)] border border-[var(--border)] hover:bg-gray-50",
  ghost: "bg-transparent text-[var(--blue)] hover:underline border-none px-0",
};

export default function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
