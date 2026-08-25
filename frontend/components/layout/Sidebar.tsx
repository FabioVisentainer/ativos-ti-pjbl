"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ArrowUpFromLine,
  Wrench,
  FileText,
  ShieldCheck,
  Laptop2,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  section: string | null;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  { section: null, items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Cadastros",
    items: [
      { href: "/ativos/", label: "Ativos", icon: Package },
      { href: "/colaboradores/", label: "Colaboradores", icon: Users },
    ],
  },
  {
    section: "Operação",
    items: [
      { href: "/alocacoes/", label: "Alocações", icon: ArrowUpFromLine },
      { href: "/manutencoes/", label: "Manutenções", icon: Wrench },
    ],
  },
  {
    section: "Análise",
    items: [{ href: "/relatorios/", label: "Relatórios", icon: FileText }],
  },
  {
    section: "Administração",
    items: [{ href: "/usuarios/", label: "Usuários e Permissões", icon: ShieldCheck }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sair } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-[var(--navy)] text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Laptop2 size={17} />
          </div>
          <span className="font-semibold text-[15px]">Ativos de TI</span>
        </div>

        <nav className="px-3 py-4 flex flex-col gap-4">
          {NAV_GROUPS.map((group, i) => (
            <div key={i}>
              {group.section && (
                <div className="px-3 mb-1 text-[11px] font-semibold tracking-wider text-[#7f9bc4] uppercase">
                  {group.section}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    href === "/" ? pathname === "/" : pathname?.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--blue)] text-white"
                          : "text-[#d7e3f6] hover:bg-white/10"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <button
        onClick={sair}
        className="flex items-center gap-2.5 px-5 py-4 text-sm text-[#d7e3f6] hover:bg-white/10 border-t border-white/10"
      >
        <LogOut size={16} />
        Sair
      </button>
    </aside>
  );
}
