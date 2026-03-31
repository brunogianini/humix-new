"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/auth";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { toast } from "@/lib/toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateProfile = useUpdateProfile();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync({
      displayName: displayName || undefined,
      bio: bio || undefined,
      avatarUrl: avatarUrl || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await api.delete(`/users/${user.id}`);
      logout();
      router.push("/");
    } catch {
      // ignore
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground mb-1">Configurações</h1>
        <p className="text-sm text-muted">Gerencie seu perfil e conta.</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSave}
        className="space-y-6"
      >
        {/* Avatar preview */}
        <div className="flex items-center gap-4 p-4 bg-surface-2 rounded-xl">
          <Avatar
            src={avatarUrl || user.avatarUrl}
            name={displayName || user.displayName || user.username}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {displayName || user.displayName || user.username}
            </p>
            <p className="text-xs text-muted">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Nome de exibição"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
            maxLength={50}
          />
          <Input
            label="URL do avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você..."
            rows={3}
            maxLength={500}
          />
        </div>

        <Button
          type="submit"
          loading={updateProfile.isPending}
          className="w-full"
        >
          {saved ? (
            <><span>✓</span> Salvo!</>
          ) : (
            <><Save size={15} /> Salvar alterações</>
          )}
        </Button>
      </motion.form>

      <div className="border-t border-white/5 my-10" />

      {/* Danger zone */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-danger flex items-center gap-2">
          <AlertTriangle size={14} /> Zona de perigo
        </h2>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted hover:text-foreground"
          onClick={logout}
        >
          <LogOut size={14} /> Sair da conta
        </Button>
        <Button
          variant="danger"
          className="w-full justify-start"
          onClick={() => setDeleteModalOpen(true)}
        >
          <Trash2 size={14} /> Excluir minha conta
        </Button>
      </div>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Excluir conta"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-dim">
            Esta ação é permanente e irá remover todos os seus dados, reviews e coleção. Não pode ser desfeita.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              <Trash2 size={13} /> Excluir permanentemente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
