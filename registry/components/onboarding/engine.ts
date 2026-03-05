import type { StepConfig } from "./types";

/**
 * Evaluate whether a step should be skipped at navigation-time.
 */
export function shouldSkipStep<TData>(step: StepConfig<TData>, data: TData): boolean {
  if (step.skipWhen) {
    return step.skipWhen(data);
  }
  return false;
}

/**
 * Filter the full step list to produce the active steps for this session.
 * Called once at init — steps already completed (determined by `skipResolver`)
 * are excluded from the session entirely.
 *
 * @param steps         Full ordered step list.
 * @param skipResolver  Optional predicate; return `true` for steps to exclude.
 *                      This is for init-time filtering (e.g. returning users
 *                      who already filled certain fields).
 */
export function computeActiveSteps<TData>(
  steps: StepConfig<TData>[],
  skipResolver?: (stepId: string, data: TData) => boolean,
  data?: TData,
): StepConfig<TData>[] {
  if (!skipResolver || data === undefined) return [...steps];
  return steps.filter((step) => !skipResolver(step.id, data));
}

/**
 * Find the next navigable step index (forward), skipping dynamically hidden steps.
 * Returns -1 if there is no next step (flow is complete).
 */
export function findNextStepIndex<TData>(
  activeSteps: StepConfig<TData>[],
  currentIndex: number,
  data: TData,
): number {
  let idx = currentIndex + 1;
  while (idx < activeSteps.length) {
    if (!shouldSkipStep(activeSteps[idx], data)) {
      return idx;
    }
    idx++;
  }
  return -1;
}

/**
 * Find the previous navigable step index (backward), skipping dynamically
 * hidden and non-backable steps.
 * Returns -1 if there is no previous step.
 */
export function findPrevStepIndex<TData>(
  activeSteps: StepConfig<TData>[],
  currentIndex: number,
  data: TData,
): number {
  // `backable` on the *current* step controls whether back-navigation is allowed.
  // Here we just find the nearest previous non-skipped step.
  for (let i = currentIndex - 1; i >= 0; i--) {
    const step = activeSteps[i];
    if (shouldSkipStep(step, data)) continue;
    return i;
  }
  return -1;
}

/**
 * Compute the effective total number of visible steps (excluding dynamically skipped ones).
 */
export function computeEffectiveTotal<TData>(
  activeSteps: StepConfig<TData>[],
  data: TData,
): number {
  return activeSteps.filter((step) => !shouldSkipStep(step, data)).length;
}

/**
 * Compute the effective index of the current step among visible steps only.
 */
export function computeEffectiveIndex<TData>(
  activeSteps: StepConfig<TData>[],
  currentIndex: number,
  data: TData,
): number {
  let effectiveIdx = 0;
  for (let i = 0; i < currentIndex; i++) {
    if (!shouldSkipStep(activeSteps[i], data)) {
      effectiveIdx++;
    }
  }
  return effectiveIdx;
}

/**
 * Compute progress as a 0–1 value.
 */
export function computeProgress<TData>(
  activeSteps: StepConfig<TData>[],
  currentIndex: number,
  data: TData,
): number {
  const total = computeEffectiveTotal(activeSteps, data);
  if (total === 0) return 0;
  const index = computeEffectiveIndex(activeSteps, currentIndex, data);
  return (index + 1) / total;
}
