"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface MockUser {
  nome: string;
  perfil: string;
  iniciais: string;
}

interface AuthContextValue {
  autenticado: boolean;
  pronto: boolean;
  usuario: MockUser;
  entrar: () => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USER: MockUser = {
  nome: "Eduardo Lima",
  perfil: "Técnico de TI",
  iniciais: "E",
};

const STORAGE_KEY = "ativos-ti:autenticado";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    // Mantém a sessão mock entre recarregamentos da página (não substitui
    // autenticação real — em produção, a sessão viria do fluxo OAuth2/OIDC
    // com o Microsoft Entra ID, conforme RNF05).
    try {
      setAutenticado(window.sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // sessionStorage indisponível — segue deslogado.
    }
    setPronto(true);
  }, []);

  function entrar() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignora se o storage não estiver disponível
    }
    setAutenticado(true);
  }

  function sair() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignora
    }
    setAutenticado(false);
  }

  return (
    <AuthContext.Provider
      value={{ autenticado, pronto, usuario: MOCK_USER, entrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
