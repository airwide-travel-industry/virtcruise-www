export function createAdminQuotesRepository({ request }) {
  return {
    existingInvoice: quoteId => request(`/api/v1/admin/quotes/${encodeURIComponent(quoteId)}/invoice`),
    createInvoice: quoteId => request(`/api/v1/admin/quotes/${encodeURIComponent(quoteId)}/invoice`, { method: 'POST' }),
    issueInvoice: invoiceId => request(`/api/v1/financial/invoices/${encodeURIComponent(invoiceId)}/issue`, { method: 'POST' }),
    bankAccounts: () => request('/api/v1/finance/bank-account-configurations'),
    bankAssignment: invoiceId => request(`/api/v1/finance/invoices/${encodeURIComponent(invoiceId)}/payment-instructions/assignment`),
    paymentInstructions: invoiceId => request(`/api/v1/finance/invoices/${encodeURIComponent(invoiceId)}/payment-instructions`),
    assignBankAccount: (invoiceId, bankAccountId) => request(`/api/v1/finance/invoices/${encodeURIComponent(invoiceId)}/payment-instructions`, { method: 'POST', body: JSON.stringify({ bankAccountId }) })
  };
}
