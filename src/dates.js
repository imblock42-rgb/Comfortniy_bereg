// @ts-check

/**
 * Checks whether a checkout date string is strictly after a checkin date string.
 * Returns true when either value is missing (nothing to validate yet).
 * @param {string} checkinValue - an <input type="date"> value, e.g. "2026-09-20"
 * @param {string} checkoutValue - an <input type="date"> value, e.g. "2026-09-25"
 * @returns {boolean}
 */
export function isCheckoutAfterCheckin(checkinValue, checkoutValue) {
  if (!checkinValue || !checkoutValue) return true;
  return checkoutValue > checkinValue;
}
