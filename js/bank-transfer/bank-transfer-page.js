import { authenticationProvider } from '../auth/authentication-provider.js';
import { requireAuthentication } from '../auth/route-guard.js';
import { announce, emptyState, errorState, escapeHtml, formatDate, formatMoney, pageHeading, portalShell, portalUrl, statusBadge } from '../portal/portal-components.js';
import { createBankTransferRepository } from './bank-transfer-api.js';

const page = document.body.dataset.bankTransferPage;
const root = document.getElementById('portalRoot');
const query = new URLSearchParams(location.search);
let repository;
let user;
const list = value => Array.isArray(value) ? value : value?.content || value?.items || [];
const safeReason = value => value && String(value).length <= 500 ? String(value) : 'The proof could not be verified. Please upload a clear bank-issued PDF, JPEG or PNG.';
const referenceFor = (prefix, invoice) => `${prefix}-${String(invoice.number || invoice.id).replace(/[^A-Za-z0-9]/g, '').toUpperCase()}`.slice(0, 100);

function setPage(markup) { document.getElementById('portalPage').innerHTML = markup; document.querySelector('#portalPage h1')?.focus(); }
function steps(review, proofs, payment, receipt, booking) {
  const proof = proofs[0];
  const reviewStatus = String(review.reviewStatus || '').toUpperCase();
  const scanAccepted = proof?.status === 'ACCEPTED' && proof?.scanStatus !== 'REJECTED';
  const values = [
    ['Review Created', true, review.createdAt],
    ['Proof Uploaded', Boolean(proof), proof?.createdAt],
    ['Proof Accepted', scanAccepted, proof?.acceptedAt],
    ['Awaiting Finance Review', scanAccepted, review.updatedAt],
    ['Payment Recorded', Boolean(payment), null],
    ['Receipt Issued', Boolean(receipt), null],
    ['Booking Confirmed', String(booking?.status).toUpperCase() === 'CONFIRMED', booking?.updatedAt]
  ];
  let currentFound = false;
  return `<ol class="transfer-timeline" aria-label="Bank transfer progress">${values.map(([label, done, at]) => {
    const current = !done && !currentFound; if (current) currentFound = true;
    return `<li class="${done ? 'complete' : current ? 'current' : ''}"${current ? ' aria-current="step"' : ''}><span aria-hidden="true">${done ? '✓' : '•'}</span><div><strong>${label}</strong><small>${done ? formatDate(at, 'Complete') : current ? 'Current step' : 'Pending'}</small></div></li>`;
  }).join('')}</ol>`;
}

async function renderHome() {
  const [instructions, reviews] = await Promise.all([repository.instructions(), repository.reviews()]);
  const values = list(reviews);
  setPage(`${pageHeading('Secure payment option', 'Pay by Bank Transfer', 'Transfer funds using the authoritative details below, then send proof for independent Finance verification.', `<a class="portal-button" href="${portalUrl('/bank-transfer/new/')}">Create review case</a>`)}
    <section class="portal-panel transfer-warning" role="note"><strong>Uploading proof does not mean payment has been received.</strong><p>Finance will independently verify the funds. Payment is recorded only after approval, and your booking is confirmed separately.</p></section>
    <section class="portal-panel"><p class="portal-eyebrow">Authoritative bank instructions</p><h2>${escapeHtml(instructions.bankName)}</h2><dl class="instruction-grid">${[['Account name',instructions.accountName],['Account number',instructions.accountNumber],['Branch code',instructions.branchCode],['SWIFT',instructions.swift],['Currency',instructions.currency]].map(([k,v])=>`<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}</dl><p>${escapeHtml(instructions.importantInstructions)}</p><p class="financial-data-note">Your exact transfer reference is generated from the invoice you select when creating a review case.</p></section>
    <section class="portal-panel"><div class="panel-heading"><div><p class="portal-eyebrow">Your cases</p><h2>Recent transfer reviews</h2></div><a href="${portalUrl('/bank-transfer/status/')}">View all</a></div>${values.length ? `<div class="transfer-case-list">${values.slice(0,3).map(card).join('')}</div>` : emptyState({title:'No bank transfer reviews yet',message:'Create a review after making your transfer.'})}</section>`);
}
function card(value) { return `<article class="transfer-case"><div><small>Reference</small><strong>${escapeHtml(value.transferReference)}</strong><span>${formatMoney(value.amount,value.currency)}</span></div>${statusBadge(value.reviewStatus)}<a class="portal-button secondary" href="${portalUrl('/bank-transfer/details/',{id:value.id})}">Track progress</a></article>`; }

async function renderNew() {
  const [instructions, invoices, bookings] = await Promise.all([repository.instructions(), repository.invoices(), repository.bookings()]);
  const normalizeReference = value => String(value || '').trim().toUpperCase();
  const bookingByReference = new Map(list(bookings).map(item => [normalizeReference(item.bookingReference), item.id]));
  const available = list(invoices).filter(item => Number(item.outstanding?.amount || 0) > 0 && bookingByReference.has(normalizeReference(item.bookingReference)));
  setPage(`${pageHeading('Submit proof for verification', 'Create Bank Transfer Review Case', 'Select the invoice and enter the exact amount you transferred. The reference comes from Virtcruise records.')}
    <section class="portal-panel transfer-warning"><strong>First make the transfer using the exact reference shown.</strong><p>Using the wrong reference may delay processing.</p></section>
    ${available.length ? `<form class="portal-panel portal-form" id="reviewForm"><label><span>Invoice</span><select name="invoice" required><option value="">Choose an outstanding invoice</option>${available.map((invoice,i)=>`<option value="${i}">${escapeHtml(invoice.number)} · ${formatMoney(invoice.outstanding.amount,invoice.outstanding.currency)}</option>`).join('')}</select></label><label><span>Transfer amount</span><input name="amount" type="number" inputmode="decimal" min="0.01" step="0.01" required disabled aria-describedby="amountHelp"><small id="amountHelp">Enter the exact amount already transferred, up to the authoritative outstanding balance.</small></label><div class="reference-box" data-reference hidden><span>Reference</span><strong data-reference-value></strong><button type="button" class="portal-button secondary" data-copy>Copy reference</button><p>${escapeHtml(instructions.referenceRules)}</p><p class="proof-warning">Using the wrong reference may delay processing.</p></div><label><span>Bank account used for transfer</span><input name="bankAccount" maxlength="100" autocomplete="off" required aria-describedby="bankHelp"><small id="bankHelp">Enter the account number or account name you transferred from.</small></label><button class="portal-button" type="submit">Create review case</button></form>` : emptyState({title:'No outstanding invoices',message:'A bank transfer review can be created when an invoice has an outstanding balance.',action:`<a class="portal-button" href="${portalUrl('/financial/invoices/')}">View invoices</a>`})}`);
  const form = document.getElementById('reviewForm'); if (!form) return;
  const select = form.elements.invoice; const amount = form.elements.amount; const box = form.querySelector('[data-reference]');
  const update = () => { const invoice=available[Number(select.value)]; box.hidden=!invoice; amount.disabled=!invoice; if(invoice){box.querySelector('[data-reference-value]').textContent=referenceFor(instructions.referencePrefix,invoice);amount.max=invoice.outstanding.amount;amount.value=invoice.outstanding.amount;}else amount.value=''; };
  select.addEventListener('change',update);
  form.querySelector('[data-copy]').addEventListener('click',async()=>{await navigator.clipboard.writeText(box.querySelector('[data-reference-value]').textContent);announce('Transfer reference copied.');});
  form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;try{const invoice=available[Number(select.value)],transferred=amount.value;if(!transferred||Number(transferred)<=0||Number(transferred)>Number(invoice.outstanding.amount))throw new Error('Enter an amount no greater than the outstanding balance.');const created=await repository.create({bookingId:bookingByReference.get(normalizeReference(invoice.bookingReference)),invoiceId:invoice.id,currency:invoice.outstanding.currency,amount:transferred,bankAccount:new FormData(form).get('bankAccount'),transferReference:referenceFor(instructions.referencePrefix,invoice)});location.href=portalUrl('/bank-transfer/details/',{id:created.id});}catch(error){announce(error.message);button.disabled=false;}});
}

async function renderStatus() { const reviews=list(await repository.reviews()); setPage(`${pageHeading('Verification progress','Bank Transfer Status','Track proof review, payment recording, receipts and booking confirmation.')}<section class="portal-panel">${reviews.length?`<div class="transfer-case-list">${reviews.map(card).join('')}</div>`:emptyState({title:'No reviews to track',message:'Create a review case after making your bank transfer.',action:`<a class="portal-button" href="${portalUrl('/bank-transfer/new/')}">Create review case</a>`})}</section>`); }

async function renderDetails() {
  const id=query.get('id'); if(!id) return setPage(`${pageHeading('Bank transfer','Review not selected','Choose a review case from your status page.')} ${errorState('A review case identifier is required.',false)}`);
  const review=await repository.review(id);
  const [proofsResult,paymentsResult,receiptsResult,booking] = await Promise.all([repository.proofs(id),repository.payments(),repository.receipts(),repository.booking(review.bookingId).catch(()=>null)]);
  const proofs=list(proofsResult), payment=list(paymentsResult).find(v=>v.reference===review.transferReference), receipt=list(receiptsResult).find(v=>v.paymentReference===payment?.reference);
  const reviewStatus=String(review.reviewStatus).toUpperCase();
  const rejected=reviewStatus==='REJECTED'||reviewStatus==='AWAITING_REPLACEMENT'||proofs[0]?.status==='REJECTED';
  const awaitingReplacement=reviewStatus==='AWAITING_REPLACEMENT';
  const replacementAvailable=reviewStatus==='REJECTED'&&review.resubmissionAllowed;
  const initialUpload=!proofs.length&&reviewStatus==='AWAITING_UPLOAD';
  const uploadAvailable=initialUpload||awaitingReplacement;
  const proofHistory=proofs.length>1?`<div class="proof-history"><h3>Proof history</h3><ol>${proofs.map((proof,index)=>`<li><strong>${index===0?'Current proof':'Previous proof'}</strong><span>${escapeHtml(proof.fileName||'Proof document')} · ${escapeHtml(proof.status||'Received')}</span></li>`).join('')}</ol></div>`:'';
  setPage(`${pageHeading('Customer-safe review','Bank Transfer Progress','Finance verifies funds independently before payment and booking progression.')}
    <section class="transfer-summary"><div><small>Transfer reference</small><strong>${escapeHtml(review.transferReference)}</strong></div><div><small>Amount</small><strong>${formatMoney(review.amount,review.currency)}</strong></div><div><small>Current state</small>${statusBadge(payment?'PAYMENT_RECORDED':rejected?'PROOF_REJECTED':proofs.length?'AWAITING_REVIEW':'AWAITING_PROOF')}</div></section>
    <div class="transfer-detail-layout"><section class="portal-panel"><p class="portal-eyebrow">Progress</p><h2>Your transfer timeline</h2>${steps(review,proofs,payment,receipt,booking)}<p class="financial-payment-note">Proof received means your document arrived safely. It does not mean payment received. Finance will independently verify the funds.</p></section>
    <aside class="portal-panel"><p class="portal-eyebrow">Proof of payment</p><h2>${proofs.length?(rejected?'Replacement needed':'Your proof has been received.'):'Upload proof'}</h2>${rejected?`<div class="proof-warning" role="alert"><strong>Proof rejected</strong><p>${escapeHtml(safeReason(review.customerSafeRejectionReason))}</p>${review.resubmissionDeadline?`<small>Replacement available until ${formatDate(review.resubmissionDeadline)}</small>`:''}</div>`:''}${replacementAvailable?'<button class="portal-button" id="requestReplacement" type="button">Begin replacement upload</button>':''}${uploadAvailable?`<form id="proofForm" class="upload-form"><label for="proofFile">${awaitingReplacement?'Upload replacement proof':'Choose proof file'}</label><input id="proofFile" name="file" type="file" accept="application/pdf,image/jpeg,image/png" required><small>PDF, JPEG or PNG. The file is sent directly and is never stored by your browser.</small><button class="portal-button" type="submit">Upload proof</button><progress hidden max="1" aria-label="Uploading proof"></progress></form>`:''}${proofHistory}<div data-upload-state role="status" aria-live="polite"></div></aside></div>
    ${receipt?`<section class="portal-panel"><p class="portal-eyebrow">Receipt issued</p><h2>${escapeHtml(receipt.number)}</h2><dl class="instruction-grid"><div><dt>Amount</dt><dd>${formatMoney(receipt.total.amount,receipt.total.currency)}</dd></div><div><dt>Currency</dt><dd>${escapeHtml(receipt.total.currency)}</dd></div><div><dt>Date</dt><dd>Issued after payment recording</dd></div><div><dt>Status</dt><dd>${escapeHtml(receipt.status)}</dd></div></dl><p class="financial-data-note">Downloadable receipt will be available in a future release.</p></section>`:''}
    <section class="portal-panel"><p class="portal-eyebrow">Booking progression</p><h2>${escapeHtml(booking?.bookingReference||'Linked booking')}</h2><p>Status: <strong>${escapeHtml(booking?.status||'Awaiting financial recording')}</strong></p><a href="${portalUrl('/bookings/details/',{id:review.bookingId})}">View booking</a></section>`);
  document.getElementById('requestReplacement')?.addEventListener('click',async event=>{const button=event.currentTarget,state=document.querySelector('[data-upload-state]');button.disabled=true;state.textContent='Opening secure replacement upload…';try{await repository.requestReplacement(id);announce('Replacement upload is ready.');location.reload();}catch(error){state.textContent=error.message;button.disabled=false;}});
  document.getElementById('proofForm')?.addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget,file=form.elements.file.files[0],state=document.querySelector('[data-upload-state]'),progress=form.querySelector('progress'),button=form.querySelector('button');if(!file)return;if(!['application/pdf','image/jpeg','image/png'].includes(file.type)){state.textContent='Rejected: choose a PDF, JPEG or PNG.';return;}button.disabled=true;progress.hidden=false;state.textContent='Uploading… Your proof will be scanned securely.';try{await repository.upload(id,file);state.textContent='Accepted. Your proof has been received and is awaiting Finance review.';announce(state.textContent);setTimeout(()=>location.reload(),700);}catch(error){state.textContent=`Rejected. ${error.message}`;button.disabled=false;progress.hidden=true;}});
}

const renderers={home:renderHome,new:renderNew,status:renderStatus,details:renderDetails};
async function initialize(){user=await requireAuthentication();if(!user)return;repository=createBankTransferRepository();root.innerHTML=portalShell(user,'bank-transfer');root.addEventListener('click',async event=>{const menu=event.target.closest('.portal-menu-toggle');if(menu){const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('portalNavigation').classList.toggle('open',open);}if(event.target.closest('[data-portal-logout]')){await authenticationProvider.logout();location.replace(portalUrl('/index.html'));}});try{await renderers[page]();}catch(error){setPage(`${pageHeading('Bank transfer','We could not load this page','Your account and proof files remain secure.')} ${errorState(error.message)}`);}}initialize();
