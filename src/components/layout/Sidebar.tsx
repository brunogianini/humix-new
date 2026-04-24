"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  BarChart2,
  Rss,
  Sparkles,
  User,
  Settings,
  LogOut,
  Disc3,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Avatar } from "@/components/ui/Avatar";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/charts", label: "Rankings", icon: BarChart2 },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/recommendations", label: "Para você", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-surface hidden md:flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30 group-hover:shadow-accent/50 transition-shadow">
            <Disc3 size={17} className="text-white" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">humix</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "text-foreground bg-white/8"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/8 rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              <Icon size={17} className={active ? "text-accent" : ""} />
              {label}
            </Link>
          );
        })}

        {isAuthenticated && user && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted/60">
                Biblioteca
              </p>
            </div>
            <Link
              href={`/u/${user.username}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === `/u/${user.username}`
                  ? "text-foreground bg-white/8"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              <User size={17} />
              Meu perfil
            </Link>
            <Link
              href={`/u/${user.username}/albums`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === `/u/${user.username}/albums`
                  ? "text-foreground bg-white/8"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              <Library size={17} />
              Minha coleção
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === "/settings"
                  ? "text-foreground bg-white/8"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              <Settings size={17} />
              Configurações
            </Link>
          </>
        )}
      </nav>

      {/* User card */}
      <div className="px-3 py-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group">
            <Avatar
              src={user.avatarUrl}
              name={user.displayName || user.username}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.displayName || user.username}
              </p>
              <p className="text-xs text-muted truncate">@{user.username}</p>
            </div>
            <button
              onClick={logout}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger transition-all p-1.5 rounded-lg hover:bg-danger/10"
              title="Sair"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-2 px-1">
            <Link
              href="/login"
              className="flex items-center justify-center w-full py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="flex items-center justify-center w-full py-2 rounded-xl bg-white/8 hover:bg-white/12 text-foreground text-sm font-medium transition-colors"
            >
              Criar conta
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
