/**
 * Safe haptics wrapper.
 *
 * Imports expo-haptics lazily so components never crash if it's not installed.
 * All functions are no-ops when haptics are unavailable.
 */

let Haptics: any = null;

try {
  Haptics = require("expo-haptics");
} catch {
  // expo-haptics not installed — haptics will be silently skipped
}

export function impactLight() {
  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function impactMedium() {
  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function impactHeavy() {
  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function selectionChanged() {
  Haptics?.selectionAsync();
}

export function notificationSuccess() {
  Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function notificationWarning() {
  Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function notificationError() {
  Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
