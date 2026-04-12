"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkPlus, Headphones, CheckCircle, Trash2, ChevronDown } from "lucide-react";
import { AlbumStatus } from "@/lib/types";
import { useSetAlbumStatus, useRemoveAlbumFromCollection } from "@/hooks/useAlbums";
import { cn, statusLabel } from "@/lib/utils";

interface AlbumStatusMenuProps {
  albumId: string;
  currentStatus?: AlbumStatus | null;
}

const options: { value: AlbumStatus; label: string; icon: React.ElementType; color: string }[] = [
  { value: "WANT_TO_LISTEN", label: "Quero ouvir", icon: BookmarkPlus, color: "text-warning" },
  { value: "LISTENING", label: "Ouvindo", icon: Headphones, color: "text-accent" },
  { value: "LISTENED", label: "Ouvi", icon: CheckCircle, color: "text-success" },
];

const currentColors: Record<AlbumStatus, string> = {
  WANT_TO_LISTEN: "text-warning bg-warning/10",
  LISTENING: "text-accent bg-accent/15",
  LISTENED: "text-success bg-success/10",
};

export function AlbumStatusMenu({ albumId, currentStatus }: AlbumStatusMenuProps) {
  const [open, setOpen] = useState(false);
  const setStatus = useSetAlbumStatus();
  const remove = useRemoveAlbumFromCollection();

  const current = currentStatus ? options.find((o) => o.value === currentStatus) : null;

  const handleSelect = async (status: AlbumStatus) => {
    setOpen(false);
    await setStatus.mutateAsync({ albumId, status });
  };

  const handleRemove = async () => {
    setOpen(false);
    await remove.mutateAsync(albumId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
          current
            ? currentColors[current.value]
            : "bg-white/8 hover:bg-white/12 text-foreground"
        )}
      >
        {current ? (
          <>
            <current.icon size={15} />
            {current.label}
          </>
        ) : (
          <>
            <BookmarkPlus size={15} />
            Adicionar à coleção
          </>
        )}
        <ChevronDown size={14} className={cn("transition-transform ml-0.5", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute top-full left-0 mt-2 w-48 rounded-xl shadow-2xl shadow-black/80 z-20 overflow-hidden" style={{ backgroundColor: "#1a1a24" }}
            >
              {options.map((opt) => {
                const Icon = opt.icon;
                const isActive = currentStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                      isActive
                        ? `${opt.color} bg-white/5`
                        : "text-foreground-dim hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon size={15} className={isActive ? opt.color : ""} />
                    {opt.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </button>
                );
              })}
              {currentStatus && (
                <>
                  <div className="border-t border-white/5" />
                  <button
                    onClick={handleRemove}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 size={15} />
                    Remover da coleção
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
