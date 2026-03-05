import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

interface AuthStore {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  initialized: boolean;

  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  session: null,
  user: null,
  isLoading: true,
  initialized: false,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: () => set({ initialized: true, isLoading: false }),
}));

// ── Convenience hooks ──────────────────────────────────────────────

/** Reactive session object (or null). */
export const useSession = () => useAuthStore((s) => s.session);

/** Reactive user object (or null). */
export const useUser = () => useAuthStore((s) => s.user);

/** `true` while the initial session is being restored from storage. */
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);

/** `true` once the initial session check has completed. */
export const useAuthInitialized = () => useAuthStore((s) => s.initialized);

/** `true` when there is an active session. */
export const useIsAuthenticated = () => useAuthStore((s) => s.session !== null);

/** Returns the current access token string, or null. */
export const useAccessToken = () => useAuthStore((s) => s.session?.access_token ?? null);
