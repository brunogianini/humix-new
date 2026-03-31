"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";
import { AuthResponse, ApiError } from "@/lib/types";
import type { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
        displayName: displayName || undefined,
      });
      login(data);
      router.push("/");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const details = axiosErr.response?.data?.error?.details;
      if (details) {
        const flat: Record<string, string> = {};
        Object.entries(details).forEach(([k, v]) => {
          flat[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(flat);
      } else {
        setErrors({
          general:
            axiosErr.response?.data?.error?.message || "Erro ao criar conta.",
        });
      }
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
        <h1 className="text-xl font-bold text-foreground mb-1">Criar conta</h1>
        <p className="text-sm text-muted mb-6">Comece sua jornada musical.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu_username"
            leftIcon={<User size={15} />}
            error={errors.username}
            required
            autoComplete="username"
          />
          <Input
            label="Nome de exibição (opcional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
            leftIcon={<User size={15} />}
            error={errors.displayName}
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            leftIcon={<Mail size={15} />}
            error={errors.email}
            required
            autoComplete="email"
          />
          <Input
            label="Senha"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            leftIcon={<Lock size={15} />}
            error={errors.password}
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
            autoComplete="new-password"
          />

          {errors.general && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-danger bg-danger/8 rounded-lg px-3 py-2"
            >
              {errors.general}
            </motion.p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-2">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
