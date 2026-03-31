"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import { AuthResponse } from "@/lib/types";
import type { AxiosError } from "axios";
import type { ApiError } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
      login(data);
      router.push("/");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(
        axiosErr.response?.data?.error?.message || "Credenciais inválidas."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div className="bg-surface-2 rounded-2xl p-8 shadow-2xl shadow-black/60">
        <h1 className="text-xl font-bold text-foreground mb-1">Entrar</h1>
        <p className="text-sm text-muted mb-6">Bem-vindo de volta.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            leftIcon={<Mail size={15} />}
            required
            autoComplete="email"
          />
          <Input
            label="Senha"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="text-muted hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger bg-danger/8 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Não tem conta?{" "}
          <Link href="/register" className="text-accent hover:underline font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
