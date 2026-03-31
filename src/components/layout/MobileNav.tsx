"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BarChart2, Rss, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/charts", label: "Rankings", icon: BarChart2 },
  { href: "/feed", label: "Feed", icon: Rss },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/85 backdrop-blur-xl z-40 md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                active ? "text-accent" : "text-muted hover:text-foreground-dim"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        {isAuthenticated && user ? (
          <Link
            href={`/u/${user.username}`}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
              pathname === `/u/${user.username}` ? "text-accent" : "text-muted hover:text-foreground-dim"
            )}
          >
            <User size={20} strokeWidth={pathname === `/u/${user.username}` ? 2.5 : 1.75} />
            <span className="text-[10px] font-medium">Perfil</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-muted hover:text-foreground-dim"
          >
            <User size={20} strokeWidth={1.75} />
            <span className="text-[10px] font-medium">Entrar</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
