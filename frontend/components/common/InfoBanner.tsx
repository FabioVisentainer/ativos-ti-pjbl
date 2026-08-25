import { Info } from "lucide-react";
import { ReactNode } from "react";

export default function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-[#e7f2fd] text-[#1c4e80] text-sm rounded-xl px-4 py-3 mb-5">
      <Info size={16} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}
