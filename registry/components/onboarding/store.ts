import { create } from "zustand";
import type { OnboardingConfig, OnboardingInstance, OnboardingState, ScreenOptions, StepConfig } from "./types";

const DEFAULT_SCREEN_CONFIG: ScreenOptions = {
  title: null,
  subtitle: null,
  disabled: true,
  loading: false,
  continueLabel: null,
  continueHidden: false,
  continueHandler: null,
  secondaryAction: null,
  hideProgressBar: false,
  customFooter: null,
  headerRight: null,
};

export function createOnboardingStore<TData extends object>(
  steps: StepConfig<TData>[],
  initialData: TData,
) {
  return create<OnboardingState<TData>>()((set) => ({
    data: { ...initialData },

    currentStepIndex: 0,
    steps,
    activeSteps: steps,
    completed: false,
    navigationDirection: null,

    screenConfig: { ...DEFAULT_SCREEN_CONFIG },

    setField: (key, value) =>
      set((state) => ({
        data: { ...state.data, [key]: value },
      })),

    setData: (partial) =>
      set((state) => ({
        data: { ...state.data, ...partial },
      })),

    setScreenConfig: (config) =>
      set({
        screenConfig: { ...DEFAULT_SCREEN_CONFIG, ...config },
      }),

    updateScreenConfig: (config) =>
      set((state) => ({
        screenConfig: { ...state.screenConfig, ...config },
      })),

    setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

    setActiveSteps: (activeSteps) => set({ activeSteps }),

    setNavigationDirection: (navigationDirection) => set({ navigationDirection }),

    markCompleted: () => set({ completed: true }),

    reset: () =>
      set({
        data: { ...initialData },
        currentStepIndex: 0,
        activeSteps: steps,
        completed: false,
        navigationDirection: null,
        screenConfig: { ...DEFAULT_SCREEN_CONFIG },
      }),

    hydrateData: (partial) =>
      set((state) => {
        const merged = { ...state.data };
        for (const key of Object.keys(partial) as (keyof TData)[]) {
          if (partial[key] !== undefined && partial[key] !== null) {
            merged[key] = partial[key] as TData[typeof key];
          }
        }
        return { data: merged };
      }),
  }));
}

/**
 * Create a complete onboarding instance with config, store, and pre-typed hooks.
 *
 * ```ts
 * const onboarding = createOnboarding<MyData>({ steps, initialData });
 * export const { useData, useField } = onboarding;
 * ```
 */
export function createOnboarding<TData extends object>(
  config: OnboardingConfig<TData>,
): OnboardingInstance<TData> {
  const useStore = createOnboardingStore(config.steps, config.initialData);

  function useData(): TData;
  function useData<TResult>(selector: (data: TData) => TResult): TResult;
  function useData<TResult = TData>(selector?: (data: TData) => TResult) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore((s) => (selector ? selector(s.data) : s.data) as TResult);
  }

  function useField() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useStore((s) => s.setField);
  }

  return { config, useStore, useData, useField };
}
