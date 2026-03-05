import { createClient } from "@supabase/supabase-js";
import { createMMKV } from "react-native-mmkv";
import { AppState } from "react-native";

// TODO: Replace with your Supabase project URL and anon key
const supabaseUrl = "https://YOUR_PROJECT.supabase.co";
const supabaseAnonKey = "YOUR_ANON_KEY";

// MMKV storage adapter for fast, synchronous session persistence
const mmkv = createMMKV({ id: "supabase-storage" });

const mmkvStorageAdapter = {
  getItem: (key: string) => mmkv.getString(key) ?? null,
  setItem: (key: string, value: string) => mmkv.set(key, value),
  removeItem: (key: string) => {
    mmkv.remove(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auto-refresh token when app returns to foreground
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
