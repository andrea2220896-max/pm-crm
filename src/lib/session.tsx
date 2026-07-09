import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DIRECTORA_NAME } from "./constants";

const STORAGE_KEY = "wif_session_v1";

export type Session = {
  nombreCompleto: string; // e.g. "Andrea Mayo"
  nombreCorto: string; // e.g. "Andre"
  correo: string;
};

type Ctx = {
  session: Session | null;
  hydrated: boolean;
  setSession: (s: Session | null) => void;
  isDirectora: boolean;
};

const SessionCtx = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSessionState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setSession = (s: Session | null) => {
    setSessionState(s);
    if (typeof window !== "undefined") {
      if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      else localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value: Ctx = {
    session: hydrated ? session : null,
    setSession,
    isDirectora: !!session && session.nombreCompleto.trim().toLowerCase() === DIRECTORA_NAME.toLowerCase(),
  };

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession fuera de SessionProvider");
  return ctx;
}
