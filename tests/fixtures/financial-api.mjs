export const money = (amount, currency = 'ZAR') => ({ amount, currency });

export const account = {
  id: '10000000-0000-0000-0000-000000000001',
  customerId: '20000000-0000-0000-0000-000000000001',
  status: 'OPEN',
  debits: money(5000),
  credits: money(2000),
  outstanding: money(3000),
  creditBalance: money(0)
};

export const invoices = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    number: 'INV-2026-000001',
    customerId: account.customerId,
    bookingReference: 'VC-2026-000001',
    status: 'PARTIALLY_PAID',
    lines: [{
      description: 'Victoria Falls travel arrangements',
      quantity: 1,
      unitPrice: money(5000),
      taxRate: 0,
      net: money(5000),
      tax: money(0),
      total: money(5000)
    }],
    net: money(5000),
    tax: money(0),
    total: money(5000),
    allocated: money(2000),
    outstanding: money(3000)
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    number: 'INV-2026-000002',
    customerId: account.customerId,
    bookingReference: 'VC-2026-000002',
    status: 'PAID',
    lines: [],
    net: money(900, 'USD'),
    tax: money(0, 'USD'),
    total: money(900, 'USD'),
    allocated: money(900, 'USD'),
    outstanding: money(0, 'USD')
  }
];

export const payments = [{
  id: '40000000-0000-0000-0000-000000000001',
  reference: 'PAY-2026-000001',
  customerId: account.customerId,
  bookingReference: 'VC-2026-000001',
  method: 'BANK_TRANSFER',
  status: 'PARTIALLY_ALLOCATED',
  amount: money(2500),
  allocated: money(2000),
  unallocated: money(500),
  refunded: money(0)
}];

export const completedPayment = {
  ...payments[0],
  id: '40000000-0000-0000-0000-000000000002',
  reference: 'PAY-2026-000002',
  status: 'ALLOCATED',
  amount: money(900, 'USD'),
  allocated: money(900, 'USD'),
  unallocated: money(0, 'USD'),
  refunded: money(0, 'USD')
};

export const failedPayment = {
  ...payments[0],
  id: '40000000-0000-0000-0000-000000000003',
  reference: 'PAY-2026-000003',
  status: 'FAILED',
  amount: money(500),
  allocated: money(0),
  unallocated: money(500),
  refunded: money(0)
};

export const reversedPayment = {
  ...payments[0],
  id: '40000000-0000-0000-0000-000000000004',
  reference: 'PAY-2026-000004',
  status: 'REVERSED',
  amount: money(500),
  allocated: money(0),
  unallocated: money(500),
  refunded: money(500)
};

export const receipts = [{
  id: '50000000-0000-0000-0000-000000000001',
  number: 'REC-2026-000001',
  paymentReference: 'PAY-2026-000001',
  bookingReference: 'VC-2026-000001',
  status: 'ISSUED',
  total: money(2500)
}];

export const refunds = [{
  id: '60000000-0000-0000-0000-000000000001',
  paymentReference: 'PAY-2026-000001',
  status: 'REQUESTED',
  reason: 'Customer requested cancellation',
  amount: money(250)
}];

export const completedRefund = {
  ...refunds[0],
  id: '60000000-0000-0000-0000-000000000002',
  status: 'COMPLETED'
};

export const deposits = [{
  id: '70000000-0000-0000-0000-000000000001',
  bookingReference: 'VC-2026-000001',
  dueDate: '2026-09-01',
  status: 'PARTIALLY_PAID',
  required: money(1500),
  received: money(500),
  outstanding: money(1000)
}];

export function page(content, number = 0, size = 10) {
  return {
    content,
    page: number,
    size,
    totalElements: content.length,
    totalPages: content.length ? 1 : 0,
    first: true,
    last: true
  };
}
