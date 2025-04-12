
// Format currency
export const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "es-AR", {
    style: "currency",
    currency: currency === "ARS" ? "ARS" : "USD",
    maximumFractionDigits: 2,
  }).format(value);
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
