/**
 * Returns true when a promo has no user restrictions or the user is on the allow list.
 */
export function isPromoAllowedForUser(
  allowedUserIds: string[],
  userId: string | null | undefined,
): boolean {
  if (allowedUserIds.length === 0) {
    return true;
  }
  if (!userId) {
    return false;
  }
  return allowedUserIds.includes(userId);
}
