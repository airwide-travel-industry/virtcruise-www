const CURRENCIES = new Set(['USD', 'GBP', 'EUR', 'ZAR']);

export class FinancialContractError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FinancialContractError';
  }
}

function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new FinancialContractError(`${label} response was not valid.`);
  }
  return value;
}

function text(value, label, { optional = false } = {}) {
  if (optional && (value === null || value === undefined || value === '')) return null;
  if (typeof value !== 'string' || !value.trim()) {
    throw new FinancialContractError(`${label} was missing.`);
  }
  return value.trim();
}

export function mapMoney(value, label = 'Money') {
  const source = object(value, label);
  const currency = text(source.currency, `${label} currency`).toUpperCase();
  if (!CURRENCIES.has(currency)) throw new FinancialContractError(`${label} currency was unsupported.`);
  const amount = String(source.amount);
  if (!/^-?\d+(?:\.\d+)?$/.test(amount)) {
    throw new FinancialContractError(`${label} amount was invalid.`);
  }
  return Object.freeze({ amount, currency });
}

function sameCurrency(values, label) {
  const currencies = new Set(values.map(value => value.currency));
  if (currencies.size > 1) throw new FinancialContractError(`${label} mixed currencies.`);
}

export function mapAccount(value) {
  const source = object(value, 'Account');
  const result = {
    id: text(source.id, 'Account identifier'),
    status: text(source.status, 'Account status'),
    debits: mapMoney(source.debits, 'Account debits'),
    credits: mapMoney(source.credits, 'Account credits'),
    outstanding: mapMoney(source.outstanding, 'Outstanding balance'),
    creditBalance: mapMoney(source.creditBalance, 'Credit balance')
  };
  sameCurrency([result.debits, result.credits, result.outstanding, result.creditBalance], 'Account');
  return Object.freeze(result);
}

function mapInvoiceLine(value) {
  const source = object(value, 'Invoice line');
  return Object.freeze({
    description: text(source.description, 'Invoice line description'),
    quantity: String(source.quantity),
    unitPrice: mapMoney(source.unitPrice, 'Unit amount'),
    taxRate: String(source.taxRate),
    net: mapMoney(source.net, 'Line net'),
    tax: mapMoney(source.tax, 'Line tax'),
    total: mapMoney(source.total, 'Line total')
  });
}

export function mapInvoice(value) {
  const source = object(value, 'Invoice');
  const result = {
    id: text(source.id, 'Invoice identifier'),
    number: text(source.number, 'Invoice number'),
    bookingReference: text(source.bookingReference, 'Booking reference', { optional: true }),
    status: text(source.status, 'Invoice status'),
    lines: Array.isArray(source.lines) ? source.lines.map(mapInvoiceLine) : [],
    net: mapMoney(source.net, 'Invoice net'),
    tax: mapMoney(source.tax, 'Invoice tax'),
    total: mapMoney(source.total, 'Invoice total'),
    allocated: mapMoney(source.allocated, 'Invoice amount paid'),
    outstanding: mapMoney(source.outstanding, 'Invoice outstanding')
  };
  sameCurrency([result.net, result.tax, result.total, result.allocated, result.outstanding], 'Invoice');
  return Object.freeze(result);
}

export function mapPayment(value) {
  const source = object(value, 'Payment');
  const result = {
    id: text(source.id, 'Payment identifier'),
    reference: text(source.reference, 'Payment reference'),
    bookingReference: text(source.bookingReference, 'Booking reference', { optional: true }),
    method: text(source.method, 'Payment method'),
    status: text(source.status, 'Payment status'),
    amount: mapMoney(source.amount, 'Payment amount'),
    allocated: mapMoney(source.allocated, 'Allocated amount'),
    unallocated: mapMoney(source.unallocated, 'Unallocated amount'),
    refunded: mapMoney(source.refunded, 'Refunded amount')
  };
  sameCurrency([result.amount, result.allocated, result.unallocated, result.refunded], 'Payment');
  return Object.freeze(result);
}

export function mapReceipt(value) {
  const source = object(value, 'Receipt');
  return Object.freeze({
    id: text(source.id, 'Receipt identifier'),
    number: text(source.number, 'Receipt number'),
    paymentReference: text(source.paymentReference, 'Payment reference'),
    bookingReference: text(source.bookingReference, 'Booking reference', { optional: true }),
    status: text(source.status, 'Receipt status'),
    total: mapMoney(source.total, 'Receipt total')
  });
}

export function mapRefund(value) {
  const source = object(value, 'Refund');
  return Object.freeze({
    id: text(source.id, 'Refund identifier'),
    paymentReference: text(source.paymentReference, 'Payment reference'),
    status: text(source.status, 'Refund status'),
    reason: text(source.reason, 'Refund reason'),
    amount: mapMoney(source.amount, 'Refund amount')
  });
}

export function mapDeposit(value) {
  const source = object(value, 'Deposit');
  const result = {
    id: text(source.id, 'Deposit identifier'),
    bookingReference: text(source.bookingReference, 'Booking reference'),
    dueDate: text(source.dueDate, 'Deposit due date'),
    status: text(source.status, 'Deposit status'),
    required: mapMoney(source.required, 'Deposit required'),
    received: mapMoney(source.received, 'Deposit received'),
    outstanding: mapMoney(source.outstanding, 'Deposit outstanding')
  };
  sameCurrency([result.required, result.received, result.outstanding], 'Deposit');
  return Object.freeze(result);
}

export function mapPage(value, mapper) {
  const source = object(value, 'Page');
  if (!Array.isArray(source.content)) throw new FinancialContractError('Page content was missing.');
  const page = Number(source.page);
  const size = Number(source.size);
  const totalElements = Number(source.totalElements);
  const totalPages = Number(source.totalPages);
  if (![page, size, totalElements, totalPages].every(Number.isInteger)) {
    throw new FinancialContractError('Pagination metadata was invalid.');
  }
  return Object.freeze({
    items: source.content.map(mapper),
    page,
    size,
    totalElements,
    totalPages,
    first: Boolean(source.first),
    last: Boolean(source.last)
  });
}

export const financialMappers = Object.freeze({
  account: mapAccount,
  invoice: mapInvoice,
  payment: mapPayment,
  receipt: mapReceipt,
  refund: mapRefund,
  deposit: mapDeposit
});
