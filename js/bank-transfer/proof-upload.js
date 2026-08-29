import { announce, escapeHtml, formatDate, portalUrl } from '../portal/portal-components.js';

const values = value => Array.isArray(value) ? value : value?.content || value?.items || [];
const money = (value, currency) => new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: 2 }).format(Number(value || 0));
const today = () => new Date().toISOString().slice(0, 10);

function eligibleInvoices(invoices, bookings) {
  const bookingIds = new Map(values(bookings).map(item => [String(item.bookingReference || '').toUpperCase(), item.id]));
  return values(invoices).filter(invoice => Number(invoice.outstanding?.amount || 0) > 0
    && bookingIds.has(String(invoice.bookingReference || '').toUpperCase()))
    .map(invoice => ({ ...invoice, bookingId: bookingIds.get(String(invoice.bookingReference || '').toUpperCase()) }));
}

export function openProofUpload({ repository, invoiceId = null, onSubmitted = () => {} }) {
  const existing = document.getElementById('proofUploadDialog');
  existing?.remove();
  const dialog = document.createElement('dialog');
  dialog.id = 'proofUploadDialog';
  dialog.className = 'proof-upload-dialog';
  dialog.innerHTML = '<div data-proof-upload-content><p>Loading eligible invoices…</p></div>';
  document.body.append(dialog);
  dialog.showModal();

  const close = () => dialog.close();
  dialog.addEventListener('close', () => dialog.remove(), { once: true });

  Promise.all([repository.invoices(), repository.bookings()]).then(async ([invoices, bookings]) => {
    const eligible = eligibleInvoices(invoices, bookings);
    const selected = eligible.find(item => item.id === invoiceId) || eligible[0];
    if (!selected) {
      dialog.querySelector('[data-proof-upload-content]').innerHTML = '<form method="dialog" class="proof-upload-form"><h2>UPLOAD PROOF OF PAYMENT</h2><p>No eligible invoice is currently available for proof submission.</p><button class="portal-button secondary">Close</button></form>';
      return;
    }
    let instruction = null;
    try { instruction = await repository.instructions(selected.id); } catch (error) {
      dialog.querySelector('[data-proof-upload-content]').innerHTML = `<form method="dialog" class="proof-upload-form"><h2>UPLOAD PROOF OF PAYMENT</h2><p role="alert">${escapeHtml(error.message || 'Payment instructions are unavailable for this invoice.')}</p><button class="portal-button secondary">Close</button></form>`;
      return;
    }
    const options = eligible.map(item => `<option value="${escapeHtml(item.id)}" ${item.id === selected.id ? 'selected' : ''}>${escapeHtml(item.number)} · ${money(item.outstanding.amount, item.outstanding.currency)}</option>`).join('');
    dialog.querySelector('[data-proof-upload-content]').innerHTML = `<form class="proof-upload-form" data-proof-form>
      <div class="panel-heading"><div><p class="portal-eyebrow">Customer submission</p><h2>UPLOAD PROOF OF PAYMENT</h2></div><button type="button" class="portal-link" data-proof-close aria-label="Close upload proof of payment">Close</button></div>
      <label>Invoice<select name="invoiceId" required>${options}</select></label>
      <label>Amount Due<input name="amountDue" readonly value="${money(selected.outstanding.amount, selected.outstanding.currency)}"></label>
      <label>Amount Transferred<input name="amount" type="number" inputmode="decimal" min="0.01" step="0.01" max="${escapeHtml(selected.outstanding.amount)}" required></label>
      <label>Transfer Date<input name="transferDate" type="date" max="${today()}" value="${today()}" required></label>
      <label>Bank / Sender<input name="bankAccount" maxlength="100" autocomplete="off" required></label>
      <label>Payment Reference<input name="transferReference" value="${escapeHtml(instruction.customerReference)}" readonly required></label>
      <label>Proof of Payment<input name="file" type="file" accept="application/pdf,image/jpeg,image/png" required><small>PDF, JPG, JPEG or PNG up to 10 MB.</small></label>
      <label>Optional note<textarea name="customerNote" maxlength="2000" rows="3"></textarea></label>
      <p class="proof-warning">Uploading proof does not mean payment has been received. Finance will independently verify cleared funds.</p>
      <p role="status" aria-live="polite" data-proof-message></p>
      <div class="form-actions"><button type="button" class="portal-button secondary" data-proof-close>Cancel</button><button class="portal-button" type="submit">Submit for Review</button></div>
    </form>`;
    const form = dialog.querySelector('[data-proof-form]');
    const refreshInvoice = async () => {
      const next = eligible.find(item => item.id === form.elements.invoiceId.value);
      if (!next) return;
      try {
        instruction = await repository.instructions(next.id);
        form.elements.amountDue.value = money(next.outstanding.amount, next.outstanding.currency);
        form.elements.amount.max = next.outstanding.amount;
        form.elements.transferReference.value = instruction.customerReference;
      } catch (error) { form.querySelector('[data-proof-message]').textContent = error.message; }
    };
    form.elements.invoiceId.addEventListener('change', refreshInvoice);
    dialog.querySelectorAll('[data-proof-close]').forEach(button => button.addEventListener('click', close));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = form.querySelector('[type="submit"]');
      const message = form.querySelector('[data-proof-message]');
      const invoice = eligible.find(item => item.id === form.elements.invoiceId.value);
      const file = form.elements.file.files[0];
      if (!invoice || !file) return;
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) { message.textContent = 'Choose a PDF, JPEG or PNG file.'; return; }
      const amount = Number(form.elements.amount.value);
      if (!amount || amount <= 0 || amount > Number(invoice.outstanding.amount)) { message.textContent = 'Enter an amount no greater than the outstanding balance.'; return; }
      button.disabled = true;
      message.textContent = 'Submitting securely for Finance review…';
      try {
        const created = await repository.create({ bookingId: invoice.bookingId, invoiceId: invoice.id, currency: invoice.outstanding.currency, amount, bankAccount: form.elements.bankAccount.value.trim(), destinationBankAccountId: instruction.bankAccountId, transferReference: form.elements.transferReference.value, transferDate: form.elements.transferDate.value, customerNote: form.elements.customerNote.value.trim() || null });
        await repository.upload(created.id, file);
        message.textContent = 'Submitted for Finance review. This does not mean payment has been received.';
        announce(message.textContent);
        onSubmitted(created);
        setTimeout(close, 700);
      } catch (error) { message.textContent = error.message || 'Proof submission could not be completed.'; button.disabled = false; }
    });
  }).catch(error => { dialog.querySelector('[data-proof-upload-content]').innerHTML = `<form method="dialog" class="proof-upload-form"><h2>UPLOAD PROOF OF PAYMENT</h2><p role="alert">${escapeHtml(error.message)}</p><button class="portal-button secondary">Close</button></form>`; });
}
