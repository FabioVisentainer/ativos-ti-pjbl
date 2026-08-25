import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-9 h-9 rounded-lg bg-[#e7f0fb] text-[var(--blue)] flex items-center justify-center">
              <Icon size={18} />
            </div>
          )}
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-sm text-[var(--text-muted)] mt-1.5 ml-[46px]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
