
// Format currency
export const formatCurrency = (value: number, currency: string) => {
  if (currency === "BTC") {
    return `${value.toFixed(8)} BTC`;
  } else if (["ETH", "BNB", "SOL", "DOT", "ADA", "AVAX", "TRX"].includes(currency)) {
    return `${value.toFixed(6)} ${currency}`;
  } else if (["USDT", "USDC", "DAI", "USD"].includes(currency)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } else {
    return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "es-AR", {
      style: "currency",
      currency: currency === "ARS" ? "ARS" : "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }
};

// Format percentage
export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

// Format time
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format large numbers (millions, billions)
export const formatLargeNumber = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
};
