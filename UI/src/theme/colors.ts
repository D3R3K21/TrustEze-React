/**
 * Shared theme colors for the app.
 * Use these in components and CSS (e.g. via var(--color-primary)).
 */

export const colors = {
  /** Primary brand color */
  primary: "#8b7355",
  /** Primary hover / darker variant */
  primaryHover: "#6b5a42",
} as const;

export type ThemeColors = typeof colors;
