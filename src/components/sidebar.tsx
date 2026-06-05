"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Dashboard", icon: "◻" },
  { href: "/imoveis", label: "Imóveis", icon: "🏠" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/corretores", label: "Corretores", icon: "⭐" },
  { href: "/contratos", label: "Contratos", icon: "📄" },
  { href: "/visitas", label: "Visitas", icon: "📅" },
  { href: "/mapa", label: "Mapa", icon: "🗺" },
  { href: "/relatorios", label: "Relatórios", icon: "📊" },
  { href: "/leads", label: "Leads", icon: "📨" },
  { href: "/config", label: "Configurações", icon: "⚙" },
];

export function Sidebar({ userName, userEmail, userRole }: { userName: string; userEmail: string; userRole: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-white lg:hidden">
        ☰
      </button>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-secondary text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <span className="text-lg font-bold">ImoCRM</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white lg:hidden">✕</button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
          {userRole === "admin" && (
            <Link href="/config/usuarios" onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith("/config/usuarios") ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
              <span>🔐</span>
              Usuários
            </Link>
          )}
        </nav>
        <div className="border-t border-white/10 p-4 space-y-2">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{userName.charAt(0).toUpperCase()}</div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-white">{userName}</p>
              <p className="text-xs text-white/50">{userEmail}</p>
            </div>
            <form action="/api/logout" method="post">
              <button type="submit" className="text-xs text-white/40 hover:text-white" title="Sair">⏻</button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
