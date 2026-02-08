/**
 * Assigns a deterministic risk rating per property id.
 * Use for badges and map pin colors: High Risk (Purple), Medium Risk (Yellow), Low Risk (Green).
 */

export type RiskLevel = 'high' | 'medium' | 'low';

const RISK_LEVELS: RiskLevel[] = ['high', 'medium', 'low'];

/** Deterministically pick a risk level from a string id (e.g. property.id). */
export function getRiskRating(propertyId: string): RiskLevel {
  let hash = 0;
  const str = String(propertyId);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % RISK_LEVELS.length;
  return RISK_LEVELS[index];
}

/** Display label per risk level. */
export const RISK_LABELS: Record<RiskLevel, string> = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
};

/** Background/border color for badges and pin fill. */
export const RISK_COLORS: Record<RiskLevel, string> = {
  high: '#7c3aed',   // purple
  medium: '#eab308', // yellow
  low: '#22c55e',    // green
};

export function getRiskLabel(level: RiskLevel): string {
  return RISK_LABELS[level];
}

export function getRiskColor(level: RiskLevel): string {
  return RISK_COLORS[level];
}
