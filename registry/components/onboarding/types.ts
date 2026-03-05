import type React from "react";
import type { StoreApi, UseBoundStore } from "zustand";

// ---------------------------------------------------------------------------
// Step Configuration
// ---------------------------------------------------------------------------

export interface StepConfig<TData = object> {
  /** Unique identifier for this step. */
  id: string;
  /** Navigation route path (e.g. '/onboarding/gender'). */
  route: string;
  /** Default header title shown for this step. */
  title?: string;
  /** Default header subtitle shown for this step. */
  subtitle?: string;
  /** Whether the user can navigate back from this step. Defaults to `true`. */
  backable?: boolean;
  /** Logical group name — all steps in a group share skip logic. */
  group?: string;
  /**
   * Predicate evaluated at navigation-time. Return `true` to skip this step.
   * Called with the current onboarding data snapshot.
   */
  skipWhen?: (data: TData) => boolean;
}

// ---------------------------------------------------------------------------
// Lifecycle Hooks
// ---------------------------------------------------------------------------

export interface OnboardingHooks<TData = object> {
  /** Called after each step transition (after navigation completes). */
  onStepComplete?: (stepId: string, data: TData) => void | Promise<void>;
  /** Called when the flow reaches the final step and completes. */
  onFlowComplete?: (data: TData) => void | Promise<void>;
  /**
   * Gate called before every step change. Return `false` to block navigation.
   * Receives the direction of travel.
   */
  beforeStepChange?: (
    fromStepId: string,
    toStepId: string,
    direction: "forward" | "backward",
    data: TData,
  ) => boolean | Promise<boolean>;
  /** Called when a step is skipped due to `skipWhen` returning `true`. */
  onStepSkipped?: (stepId: string, data: TData) => void;
}

// ---------------------------------------------------------------------------
// Navigation Adapter
// ---------------------------------------------------------------------------

export interface NavigationAdapter {
  push(route: string): void;
  replace(route: string): void;
  back(): void;
  getCurrentRoute(): string | undefined;
}

// ---------------------------------------------------------------------------
// Screen Options (per-screen transient config)
// ---------------------------------------------------------------------------

export interface SecondaryAction {
  label: string;
  onPress: () => void;
}

export interface ScreenOptions {
  title?: string | null;
  subtitle?: string | null;
  disabled?: boolean;
  loading?: boolean;
  continueLabel?: string | null;
  continueHidden?: boolean;
  continueHandler?: (() => void | Promise<void>) | null;
  secondaryAction?: SecondaryAction | null;
  hideProgressBar?: boolean;
  customFooter?: React.ReactNode | null;
  headerRight?: React.ReactNode | null;
}

// ---------------------------------------------------------------------------
// Store State
// ---------------------------------------------------------------------------

export interface OnboardingState<TData = object> {
  // User data
  data: TData;

  // Flow state
  currentStepIndex: number;
  steps: StepConfig<TData>[];
  activeSteps: StepConfig<TData>[];
  completed: boolean;
  navigationDirection: "forward" | "backward" | null;

  // Per-screen transient config
  screenConfig: ScreenOptions;

  // --- Actions ---
  setField: <K extends keyof TData>(key: K, value: TData[K]) => void;
  setData: (partial: Partial<TData>) => void;
  setScreenConfig: (config: ScreenOptions) => void;
  updateScreenConfig: (config: Partial<ScreenOptions>) => void;
  setCurrentStepIndex: (index: number) => void;
  setActiveSteps: (steps: StepConfig<TData>[]) => void;
  setNavigationDirection: (dir: "forward" | "backward" | null) => void;
  markCompleted: () => void;
  reset: () => void;
  hydrateData: (data: Partial<TData>) => void;
}

// ---------------------------------------------------------------------------
// Onboarding Config (input to createOnboarding)
// ---------------------------------------------------------------------------

export interface OnboardingConfig<TData = object> {
  steps: StepConfig<TData>[];
  initialData: TData;
  hooks?: OnboardingHooks<TData>;
}

// ---------------------------------------------------------------------------
// Onboarding Instance (output of createOnboarding)
// ---------------------------------------------------------------------------

export interface OnboardingInstance<TData = object> {
  config: OnboardingConfig<TData>;
  useStore: UseBoundStore<StoreApi<OnboardingState<TData>>>;
  /** Pre-typed selector hook for reading onboarding data. */
  useData: {
    (): TData;
    <TResult>(selector: (data: TData) => TResult): TResult;
  };
  /** Pre-typed hook for getting the `setField` action. */
  useField: () => <K extends keyof TData>(key: K, value: TData[K]) => void;
}
