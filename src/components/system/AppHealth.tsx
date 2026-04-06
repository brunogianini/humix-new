"use client";

import { useHealthCheck } from "@/hooks/useHealthCheck";



export function AppHealth() {
  useHealthCheck();
  return null;
}