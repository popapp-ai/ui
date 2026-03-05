import { useCallback, useMemo, useRef } from "react";
import {
  computeEffectiveIndex,
  computeEffectiveTotal,
  computeProgress,
  findNextStepIndex,
  findPrevStepIndex,
} from "./engine";
import { useOnboardingContext } from "./context";
import type { StepConfig } from "./types";

const NAVIGATION_COOLDOWN_MS = 300;

/**
 * Primary hook for controlling onboarding flow navigation.
 *
 * ```tsx
 * const { goNext, goBack, progress, canGoBack, currentStep } = useOnboarding();
 * ```
 */
export function useOnboarding<TData extends object>() {
  const { instance, adapter, hooks } = useOnboardingContext<TData>();
  const { useStore } = instance;

  const currentStepIndex = useStore((s) => s.currentStepIndex);
  const activeSteps = useStore((s) => s.activeSteps);
  const data = useStore((s) => s.data);
  const completed = useStore((s) => s.completed);
  const isNavigatingRef = useRef(false);

  const effectiveTotal = useMemo(
    () => computeEffectiveTotal(activeSteps, data),
    [activeSteps, data],
  );

  const effectiveIndex = useMemo(
    () => computeEffectiveIndex(activeSteps, currentStepIndex, data),
    [activeSteps, currentStepIndex, data],
  );

  const progress = useMemo(
    () => computeProgress(activeSteps, currentStepIndex, data),
    [activeSteps, currentStepIndex, data],
  );

  const currentStep: StepConfig<TData> | null = activeSteps[currentStepIndex] ?? null;

  const isFirstStep = effectiveIndex === 0;
  const isLastStep = effectiveIndex === effectiveTotal - 1;

  const canGoBack = useMemo(() => {
    if (currentStepIndex <= 0) return false;
    if (currentStep?.backable === false) return false;
    return findPrevStepIndex(activeSteps, currentStepIndex, data) >= 0;
  }, [activeSteps, currentStepIndex, currentStep, data]);

  const goNext = useCallback(async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    
    try {
      const store = useStore.getState();
      const { activeSteps: steps, data: currentData, currentStepIndex: idx } = store;
      const fromStep = steps[idx];
      console.log("going next", fromStep);

      if (hooks.onStepComplete && steps) {
        console.log("onStepComplete", fromStep.id);
        await hooks.onStepComplete(fromStep.id, currentData);
      }

      const nextIdx = findNextStepIndex(steps, idx, currentData);

      if (nextIdx >= 0) {
        const toStep = steps[nextIdx];

        if (hooks.beforeStepChange && fromStep) {
          console.log("beforeStepChange", fromStep.id);
          const allowed = await hooks.beforeStepChange(
            fromStep.id,
            toStep.id,
            "forward",
            currentData,
          );
          if (!allowed) return;
        }

        // Fire onStepSkipped for any steps between current and next
        if (hooks.onStepSkipped) {
          for (let i = idx + 1; i < nextIdx; i++) {
            console.log("onStepSkipped", steps[i].id);
            hooks.onStepSkipped(steps[i].id, currentData);
          }
        }

        console.log("setting navigation direction to forward");
        store.setNavigationDirection("forward");
        store.setCurrentStepIndex(nextIdx);
        adapter.push(toStep.route);
      } else {
        console.log("marking completed");
        store.markCompleted();
        if (hooks.onFlowComplete) {
          console.log("onFlowComplete");
          await hooks.onFlowComplete(currentData);
        }
      }
    } finally {
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, NAVIGATION_COOLDOWN_MS);
    }
  }, [useStore, adapter, hooks]);

  const goBack = useCallback(() => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    try {
      const store = useStore.getState();
      const { activeSteps: steps, data: currentData, currentStepIndex: idx } = store;

      const prevIdx = findPrevStepIndex(steps, idx, currentData);
      if (prevIdx < 0) return;

      const fromStep = steps[idx];
      const toStep = steps[prevIdx];

      if (hooks.beforeStepChange && fromStep) {
        const allowed = hooks.beforeStepChange(fromStep.id, toStep.id, "backward", currentData);
        if (allowed === false) return;
      }

      store.setNavigationDirection("backward");
      store.setCurrentStepIndex(prevIdx);
      adapter.back();
    } finally {
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, NAVIGATION_COOLDOWN_MS);
    }
  }, [useStore, adapter, hooks]);

  return {
    goNext,
    goBack,
    progress,
    canGoBack,
    currentStep,
    isFirstStep,
    isLastStep,
    totalSteps: effectiveTotal,
    currentIndex: effectiveIndex,
    completed,
  };
}
