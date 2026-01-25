// Sponsorship pricing constants
export const SPONSOR_DAILY_RATE_CENTS = 500; // $5.00 per day

// Helper to format cents as dollars
export function formatCentsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}
