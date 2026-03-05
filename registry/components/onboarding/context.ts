import { createContext, useContext } from "react";
import type { NavigationAdapter, OnboardingHooks, OnboardingInstance } from "./types";

export interface OnboardingContextValue<TData = object> {
  instance: OnboardingInstance<TData>;
  adapter: NavigationAdapter;
  hooks: OnboardingHooks<TData>;
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboardingContext<
  TData = object,
>(): OnboardingContextValue<TData> {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboardingContext must be used within an <OnboardingProvider>");
  }
  return ctx as unknown as OnboardingContextValue<TData>;
}

