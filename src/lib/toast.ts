// Lightweight toast utility (no extra deps)
export const toast = {
  success: (msg: string) => console.info("[toast]", msg),
  error: (msg: string) => console.error("[toast]", msg),
};
