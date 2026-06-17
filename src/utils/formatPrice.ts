export const formatPrice = (
  amount: number | string | undefined,
  includeDecimals: boolean = false,
): string => {
  if (amount === undefined || amount === null) return "C$0";

  const numericValue = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericValue)) return "C$0";

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  })
    .format(numericValue)
    .replace("$", "C$");
};
