export function finiteAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function quoteLineTotal(quantity, unitPrice) {
  return finiteAmount(quantity) * finiteAmount(unitPrice);
}

export function quoteGrandTotal(items) {
  return (items || []).reduce((total, item) => total + quoteLineTotal(item.quantity, item.unitPrice), 0);
}

export function formatQuoteAmount(value) {
  return finiteAmount(value).toFixed(2);
}
