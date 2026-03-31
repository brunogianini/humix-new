import { Disc3 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30 group-hover:shadow-accent/50 transition-shadow">
          <Disc3 size={22} className="text-white" />
        </div>
        <span className="text-2xl font-bold text-foreground tracking-tight">humix</span>
      </Link>

      {children}
    </div>
  );
}
