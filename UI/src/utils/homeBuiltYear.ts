const MIN_YEAR = 1950;
const MAX_YEAR = 2025;
const YEAR_RANGE = MAX_YEAR - MIN_YEAR + 1;

/**
 * Returns a deterministic "random" year between 1950 and 2025 for a given seed (e.g. property id).
 * Same id always returns the same year.
 */
export function getHomeBuiltYear(seed: string): number {
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % YEAR_RANGE;
  return MIN_YEAR + index;
}

const MIN_DAYS = 90;
const MAX_DAYS = 824;
const DAYS_RANGE = MAX_DAYS - MIN_DAYS + 1;

/**
 * Returns a deterministic "random" number between 90 and 824 for a given seed (e.g. property id).
 * Use as fallback when daysOnZillow is 0 (e.g. "Days since Move-In").
 */
export function getDaysSinceMoveIn(seed: string): number {
  let hash = 0;
  const str = String(seed) + "days"; // different seed from year
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % DAYS_RANGE;
  return MIN_DAYS + index;
}

const MAX_OCCUPANT_PERCENT = 44; // 0-43 inclusive

/**
 * Returns a deterministic "random" percentage between 0 and 43 for a given seed (e.g. property id).
 * Use for "Home Occupant Share" display.
 */
export function getOccupantSharePercent(seed: string): number {
  let hash = 0;
  const str = String(seed) + "occupant";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % MAX_OCCUPANT_PERCENT;
}

const MIN_AVAILABLE_SHARES_PERCENT = 20;
const MAX_AVAILABLE_SHARES_PERCENT = 48;
const AVAILABLE_SHARES_RANGE = MAX_AVAILABLE_SHARES_PERCENT - MIN_AVAILABLE_SHARES_PERCENT + 1;

/**
 * Returns a deterministic "random" percentage between 20 and 48 for a given seed (e.g. property id).
 * Use for "Available shares" in map pin popup.
 */
export function getAvailableSharesPercent(seed: string): number {
  let hash = 0;
  const str = String(seed) + "availableshares";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % AVAILABLE_SHARES_RANGE;
  return MIN_AVAILABLE_SHARES_PERCENT + index;
}

const MIN_ANNUAL_YIELD_PERCENT = 3;
const MAX_ANNUAL_YIELD_PERCENT = 12;
const ANNUAL_YIELD_RANGE = MAX_ANNUAL_YIELD_PERCENT - MIN_ANNUAL_YIELD_PERCENT + 1;

/**
 * Returns a deterministic "random" percentage between 3 and 12 for a given seed (e.g. property id).
 * Use for "Annual Yield" display in map pin popup.
 */
export function getAnnualYieldPercent(seed: string): number {
  let hash = 0;
  const str = String(seed) + "annualyield";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % ANNUAL_YIELD_RANGE;
  return MIN_ANNUAL_YIELD_PERCENT + index;
}

const MIN_PROJECTED_ROI = 9;
const MAX_PROJECTED_ROI = 15;
const PROJECTED_ROI_RANGE = MAX_PROJECTED_ROI - MIN_PROJECTED_ROI + 1;

/**
 * Returns a deterministic "random" percentage between 9 and 15 for a given seed (e.g. property id).
 * Use for "Projected ROI" on property cards.
 */
export function getProjectedRoiPercent(seed: string): number {
  let hash = 0;
  const str = String(seed) + "projectedroi";
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % PROJECTED_ROI_RANGE;
  return MIN_PROJECTED_ROI + index;
}
