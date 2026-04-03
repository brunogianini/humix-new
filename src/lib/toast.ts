import { useToastStore } from "@/store/toasts";

export const toast = {
  success: (message: string, action?: { label: string; href: string }) =>
    useToastStore.getState().add({ type: "success", message, action }),
  error: (message: string) =>
    useToastStore.getState().add({ type: "error", message }),
};
