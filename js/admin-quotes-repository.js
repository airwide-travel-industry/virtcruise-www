export function createAdminQuotesRepository({ request }) {
  return {
    existingInvoice: quoteId => request(`/api/v1/admin/quotes/${encodeURIComponent(quoteId)}/invoice`),
    createInvoice: quoteId => request(`/api/v1/admin/quotes/${encodeURIComponent(quoteId)}/invoice`, { method: 'POST' }),
    issueInvoice: invoiceId => request(`/api/v1/financial/invoices/${encodeURIComponent(invoiceId)}/issue`, { method: 'POST' })
  };
}
