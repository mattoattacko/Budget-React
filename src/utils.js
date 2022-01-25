// Formats to local currency //
export const currencyFormatter = new Intl.NumberFormat(undefined, {
  currency: "usd",
  style: "currency",
  minimumFractionDigits: 0, // 0 because we want to show the whole number with no decimal 
})