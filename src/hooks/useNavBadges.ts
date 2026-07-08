/**
 * Resolves the `badgeKey` values referenced in lib/navigationConfig.ts (e.g.
 * 'pendingAssignments') to an actual count. Dummy numbers until the backend
 * lands — kept as a single lookup so nav items don't hardcode counts inline.
 */
const NAV_BADGE_COUNTS: Record<string, number> = {
  pendingAssignments: 2,
};

export function useNavBadges(): Record<string, number> {
  return NAV_BADGE_COUNTS;
}
