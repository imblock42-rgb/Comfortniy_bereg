import { describe, it, expect } from 'vitest';
import { isCheckoutAfterCheckin } from '../src/dates.js';

describe('isCheckoutAfterCheckin', () => {
  it('returns true when checkout is strictly after checkin', () => {
    expect(isCheckoutAfterCheckin('2026-09-20', '2026-09-25')).toBe(true);
  });

  it('returns false when checkout equals checkin', () => {
    expect(isCheckoutAfterCheckin('2026-09-20', '2026-09-20')).toBe(false);
  });

  it('returns false when checkout is before checkin', () => {
    expect(isCheckoutAfterCheckin('2026-09-20', '2026-09-10')).toBe(false);
  });

  it('returns true (nothing to validate) when either value is missing', () => {
    expect(isCheckoutAfterCheckin('', '2026-09-25')).toBe(true);
    expect(isCheckoutAfterCheckin('2026-09-20', '')).toBe(true);
    expect(isCheckoutAfterCheckin('', '')).toBe(true);
  });
});
