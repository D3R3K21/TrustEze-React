/**
 * Deterministic "random" price per share per property id.
 * Format: "$12.32/Share"
 */

/** Returns a deterministic dollar value for a given id (e.g. property.id), formatted as "$X.XX" */
export function getPricePerShare(propertyId: string): string {
  let hash = 0;
  const str = String(propertyId);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  // Spread between ~$1.00 and ~$99.99
  const normalized = (Math.abs(hash) % 9900) / 100 + 1;
  const value = Math.round(normalized * 100) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Returns display string: "$12.32/Share" */
export function getPricePerShareLabel(propertyId: string): string {
  return `${getPricePerShare(propertyId)}/Share`;
}
