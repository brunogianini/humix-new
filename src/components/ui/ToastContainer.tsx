"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useToastStore } from "@/store/toasts";

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-2 border border-border shadow-xl shadow-black/50 min-w-[260px] max-w-[340px]"
          >
            {toast.type === "success" ? (
              <CheckCircle size={16} className="text-green-400 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-red-400 shrink-0" />
            )}
            <span className="flex-1 text-sm text-foreground">{toast.message}</span>
            {toast.action && (
              <Link
                href={toast.action.href}
                className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors shrink-0"
              >
                {toast.action.label} →
              </Link>
            )}
            <button
              onClick={() => remove(toast.id)}
              className="p-0.5 text-muted hover:text-foreground transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
