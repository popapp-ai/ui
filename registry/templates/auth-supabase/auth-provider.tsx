import { useEffect } from "react";
import { supabase } from "./supabase";
import { useAuthStore } from "./auth-store";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized();

      // TODO: Add post-auth logic here (e.g., sync onboarding data)
      // if (session?.user) { ... }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle deep link auth (for OAuth redirects)
  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      createSessionFromUrl(event.url).catch(console.error);
    };

    const subscription = Linking.addEventListener("url", handleUrl);

    Linking.getInitialURL().then((url) => {
      if (url) createSessionFromUrl(url).catch(console.error);
    });

    return () => subscription.remove();
  }, []);

  return <>{children}</>;
}
