"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/ativos/", label: "Ativos de TI" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-[var(--navy)] text-white p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold leading-tight">
          Controle de Ativos de TI
        </h1>
        <p className="text-xs text-[#b8c6e0] mt-1">Projeto PJBL</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--blue)] text-white"
                  : "text-[#dbe6f6] hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
