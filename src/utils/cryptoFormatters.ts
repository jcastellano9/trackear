
/**
 * Utility functions for formatting crypto data
 */

export const formatLargeNumber = (num: number) => {
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toFixed(2)}`;
};

export const formatCurrency = (num: number) => {
  if (num >= 1000) {
    return `$${num.toLocaleString('es-AR')}`;
  } else if (num >= 1) {
    return `$${num.toFixed(2)}`;
  } else {
    return `$${num.toFixed(num < 0.01 ? 4 : 2)}`;
  }
};
