"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";
import LoginScreen from "./LoginScreen";
import AppShell from "./AppShell";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { autenticado, pronto } = useAuth();

  // Evita "flash" da tela de login antes de checar a sessão mock salva.
  if (!pronto) return null;

  if (!autenticado) return <LoginScreen />;

  return <AppShell>{children}</AppShell>;
}
