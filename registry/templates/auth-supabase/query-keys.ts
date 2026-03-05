/**
 * Query key factory pattern for React Query.
 *
 * Each key is a function that returns a tuple for type-safe, hierarchical cache keys.
 * Use with useQuery({ queryKey: queryKeys.profile(userId), ... }).
 *
 * Tips:
 * - Add new keys as you add data fetching hooks
 * - Use `as const` for type-safe key tuples
 * - Include all parameters that affect the query result
 * - Invalidate related keys together in mutations
 */
export const queryKeys = {
  // Example keys — replace with your own:
  profile: (userId: string) => ["profile", userId] as const,
  // items: (userId: string, date: string) => ["items", userId, date] as const,
  // itemsSummary: (userId: string, start: string, end: string) =>
  //   ["items-summary", userId, start, end] as const,
} as const;
