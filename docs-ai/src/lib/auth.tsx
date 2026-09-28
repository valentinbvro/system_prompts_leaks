import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { insforge, isConfigured } from './insforge';
import type { AppUser } from './types';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function toAppUser(raw: unknown): AppUser | null {
  if (!raw || typeof raw !== 'object') return null;
  const u = raw as { id: string; email: string; profile?: { name?: string; avatar_url?: string } | null };
  return { id: u.id, email: u.email, name: u.profile?.name, avatarUrl: u.profile?.avatar_url };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    let cancelled = false;
    // Also picks up the session created by the Google OAuth redirect.
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (cancelled) return;
      setUser(toAppUser(data?.user));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await insforge.auth.signInWithOAuth('google', {
      redirectTo: `${window.location.origin}/`,
      additionalParams: { prompt: 'select_account' },
    });
    if (error) throw new Error(error.message);
  }, []);

  const signOut = useCallback(async () => {
    await insforge.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
