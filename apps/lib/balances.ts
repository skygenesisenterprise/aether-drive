export function formatBalance(balance: string): string {
  const num = parseFloat(balance.replace(/[€\s,]/g, ""));

  if (num >= 999_500) {
    return `€${parseFloat((num / 1_000_000).toFixed(2))}M`;
  }
  if (num >= 1_000) {
    const decimals = num >= 10_000 ? 1 : 2;
    return `€${parseFloat((num / 1_000).toFixed(decimals))}K`;
  }
  return `€${parseFloat(num.toFixed(2))}`;
}
