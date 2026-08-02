import { requireFinanceAccess } from '../auth/route-guard.js';
import { authenticationProvider } from '../auth/authentication-provider.js';
import { portalUrl, escapeHtml, announce } from '../portal/portal-components.js';
import { createBankTransferRepository } from './bank-transfer-repository.js';
import { canOpenProof, isTerminal, newIdempotencyKey } from './finance-model.js';
import { financeShell, heading, queueTable, badge, dateTime, money, shortId, errorView } from './finance-components.js';
import { openProofViewer, closeProofViewer } from './proof-viewer.js';

const root=document.getElementById('portalRoot'), pageName=document.body.dataset.financePage;
let repository,user,currentPage=0,currentCase=null,busy=false;
let selectedStatus=new URLSearchParams(location.search).get('status')||'';
const mutationKeys=new Map();
const setPage=html=>{document.getElementById('portalPage').innerHTML=html;};
const statusForPage=()=>'';
const params=()=>new URLSearchParams(location.search);

function queueOptions() {
  const status=document.querySelector('[data-status]')?.value ?? selectedStatus ?? statusForPage();
  const sort=document.querySelector('[data-sort]')?.value||'createdAt'; const direction=document.querySelector('[data-direction]')?.value||'desc';
  return {page:currentPage,size:20,...(status?{status}:{}),sort,direction};
}
async function renderQueue() {
  const page=await repository.list(queueOptions());
  let items=page.items;
  if(pageName==='assigned')items=items.filter(r=>r.reviewerId===user.id);
  if(pageName==='unassigned')items=items.filter(r=>!r.reviewerId);
  if(pageName==='overdue')items=items.filter(r=>r.slaBreached);
  if(pageName==='completed')items=items.filter(r=>['APPROVED','REJECTED','EXPIRED','CANCELLED'].includes(r.reviewStatus));
  const shown={...page,items};
  const gap=['assigned','unassigned','overdue','completed'].includes(pageName)?'<p class="financial-data-note">Reviewer, assignment, SLA, and multi-status filters are not supported by the accepted API. This labelled view narrows only the currently loaded server page; totals remain the server result total.</p>':'';
  setPage(`${heading('Bank transfer operations',({assigned:'My Assigned Cases',unassigned:'Unassigned Cases',overdue:'Overdue Cases',completed:'Completed Reviews'}[pageName]||'Review Queue'),'Proof is evidence, not confirmation of cleared funds. Verify funds independently before approval.','<button class="portal-button secondary" type="button" data-refresh>Refresh queue</button>')}<form class="finance-filters" data-filters><label>Status<select data-status><option value="">All statuses</option>${['NEW','AWAITING_UPLOAD','PROOF_RECEIVED','UNDER_REVIEW','APPROVED','REJECTED','EXPIRED','CANCELLED'].map(s=>`<option value="${s}" ${queueOptions().status===s?'selected':''}>${s.replaceAll('_',' ')}</option>`).join('')}</select></label><label>Sort by<select data-sort>${[['createdAt','Created'],['updatedAt','Updated'],['slaDueAt','SLA due'],['reviewStatus','Status'],['amount','Amount']].map(([v,l])=>`<option value="${v}" ${queueOptions().sort===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Direction<select data-direction><option value="desc">Descending</option><option value="asc">Ascending</option></select></label><button class="portal-button" type="submit">Apply server filters</button></form>${gap}<p class="results-count" aria-live="polite">Showing ${items.length} cases on this page; ${page.totalElements} server matches.</p>${queueTable(shown)}`);
}

async function renderOverview() {
  const statuses=['PROOF_RECEIVED','UNDER_REVIEW','APPROVED','REJECTED','EXPIRED'];
  const results=await Promise.all(statuses.map(status=>repository.list({status,page:0,size:1})));
  const values=Object.fromEntries(statuses.map((s,i)=>[s,results[i].totalElements]));
  setPage(`${heading('Finance operations','Finance Overview','Authoritative totals from the accepted review API. Proof evidence never establishes that funds have cleared.','<button class="portal-button secondary" type="button" data-refresh>Refresh totals</button>')}<section class="financial-summary-grid" aria-label="Finance review totals">${[['Pending proof review',values.PROOF_RECEIVED,'/finance/bank-transfers/?status=PROOF_RECEIVED'],['Under review',values.UNDER_REVIEW,'/finance/bank-transfers/?status=UNDER_REVIEW'],['Approved',values.APPROVED,'/finance/bank-transfers/completed/'],['Rejected',values.REJECTED,'/finance/bank-transfers/?status=REJECTED'],['Expired',values.EXPIRED,'/finance/bank-transfers/?status=EXPIRED']].map(([l,n,p])=>`<article class="financial-summary"><span>${l}</span><strong>${n}</strong><a href="${portalUrl(p)}">View cases</a></article>`).join('')}</section><p class="financial-data-note">The API does not expose authoritative unassigned, assigned-to-me, overdue aggregate totals, or recent activity. Those cards are intentionally omitted.</p>`);
}

const fact=(term,value)=>`<div><dt>${escapeHtml(term)}</dt><dd>${value}</dd></div>`;
function actionButtons(review,proof) {
  if(isTerminal(review))return '<p class="financial-data-note">This case is terminal. Operational mutations are unavailable.</p>';
  const safe=proof&&canOpenProof(proof);
  const ownedByOther=review.reviewerId&&review.reviewerId!==user.id;
  return `${ownedByOther?'<p class="proof-warning">Another reviewer owns this case. Refresh or resolve assignment before starting or deciding.</p>':''}<div class="finance-actions">${!review.reviewerId?'<button class="portal-button" data-action="assign">Assign to me</button>':'<button class="portal-button secondary" data-action="unassign">Remove assignment</button>'}${review.reviewStatus==='PROOF_RECEIVED'&&safe&&!ownedByOther?'<button class="portal-button" data-action="start">Start review</button>':''}${review.reviewStatus==='UNDER_REVIEW'&&!ownedByOther?'<button class="portal-button" data-action="approve">Approve</button><button class="portal-button danger" data-action="reject">Reject</button>':''}</div>`;
}
async function renderDetail({refresh=false}={}) {
  const id=params().get('id'); if(!id){setPage(`${heading('Finance case','No case selected','Open a case from the review queue.')}<a class="portal-button" href="${portalUrl('/finance/bank-transfers/')}">Review queue</a>`);return;}
  const [review,proofs]=await Promise.all([repository.get(id,{refresh}),repository.proofs(id,{refresh})]); currentCase=review;
  const proof=proofs[0];
  setPage(`${heading('Bank transfer review',`Case ${shortId(review.id)}`,'Operational review only. Viewing proof does not validate payment.','<button class="portal-button secondary" type="button" data-refresh>Refresh case</button>')}<div class="detail-layout"><div><section class="portal-panel"><h2>Case details</h2><dl class="finance-detail-grid">${fact('Customer ID',escapeHtml(review.customerId))}${fact('Booking ID',escapeHtml(review.bookingId))}${fact('Invoice ID',escapeHtml(review.invoiceId))}${fact('Expected amount',`<span aria-label="Amount and currency: ${escapeHtml(money(review))}">${escapeHtml(money(review))}</span>`)}${fact('Destination bank account',escapeHtml(review.bankAccount))}${fact('Customer transfer reference',escapeHtml(review.transferReference))}${fact('Status',badge(review.reviewStatus))}${fact('Proof status',badge(review.proofStatus))}${fact('Assigned reviewer',escapeHtml(review.reviewerId||'Unassigned'))}${fact('SLA',review.slaBreached?'<strong class="sla-breached">Breached</strong>':`Due ${escapeHtml(dateTime(review.slaDueAt))}`)}${fact('Created',escapeHtml(dateTime(review.createdAt)))}${fact('Updated',escapeHtml(dateTime(review.updatedAt)))}${review.decisionReason?fact('Decision reason',escapeHtml(review.decisionReason)):''}</dl></section><section class="portal-panel finance-comments"><p class="portal-eyebrow">Internal Finance only</p><h2>Add internal comment</h2><p>The accepted API records immutable comments but does not expose comment history.</p><form data-comment><label for="financeComment">Comment (maximum 2,000 characters)</label><textarea id="financeComment" required maxlength="2000" rows="4"></textarea><button class="portal-button" type="submit">Add internal comment</button></form></section></div><aside><section class="portal-panel sticky-summary"><p class="portal-eyebrow">Proof evidence</p><h2>${proof?escapeHtml(proof.fileName):'No proof metadata'}</h2>${proof?`<dl class="summary-list">${fact('Document status',badge(proof.status))}${fact('Scan status',badge(proof.scanStatus))}${fact('Detected type',escapeHtml(proof.mediaType))}${fact('File size',`${(proof.size/1024).toFixed(1)} KiB`)}${fact('Uploaded',escapeHtml(dateTime(proof.createdAt)))}${fact('Retention until',escapeHtml(dateTime(proof.retentionUntil)))}</dl>${canOpenProof(proof)?'<button class="portal-button secondary" data-open-proof>Securely view proof</button>':'<p class="proof-warning">This document cannot be opened because it is not both accepted and clean.</p>'}`:'<p>No proof document is available.</p>'}<p class="financial-data-note">Proof is evidence. Independently verify cleared funds in the bank account.</p>${actionButtons(review,proof)}</section></aside></div>`);
}

function decisionDialog(kind,review) {
  const approve=kind==='approve'; const dialog=document.createElement('dialog'); dialog.className='finance-decision'; dialog.setAttribute('aria-labelledby','decisionTitle');
  dialog.innerHTML=`<form method="dialog" data-decision-form><p class="portal-eyebrow">Auditable operational decision</p><h2 id="decisionTitle">${approve?'Approve review':'Reject review'}</h2><dl>${fact('Customer',escapeHtml(review.customerId))}${fact('Booking / invoice',`${escapeHtml(review.bookingId)} / ${escapeHtml(review.invoiceId)}`)}${fact('Expected amount',escapeHtml(money(review)))}${fact('Transfer reference',escapeHtml(review.transferReference))}${fact('Destination account',escapeHtml(review.bankAccount))}${fact('Reviewer',escapeHtml(review.reviewerId||'Unassigned'))}${fact('Case / proof status',`${badge(review.reviewStatus)} ${badge(review.proofStatus)}`)}</dl>${approve?'<div class="attestation"><strong>Required attestation</strong><p>I independently verified that cleared funds were received in the appropriate bank account, and that amount and currency match. The proof alone is insufficient. This is an auditable operational decision; downstream financial processing occurs separately.</p><label><input type="checkbox" required data-attest> I attest to the cleared-funds verification above.</label></div>':'<p>The decision remains immutable. Permit one time-limited replacement only when the customer can correct the proof without changing the transfer.</p><label><input type="checkbox" data-replacement> Permit a replacement proof</label><label for="customerSafeReason">Customer-safe reason (required when replacement is permitted, maximum 500 characters)</label><textarea id="customerSafeReason" maxlength="500" rows="2"></textarea>'}<label for="decisionReason">${approve?'Approval reason':'Internal rejection reason'} (required, maximum 500 characters)</label><textarea id="decisionReason" required maxlength="500" rows="3"></textarea><div class="form-actions"><button class="portal-button secondary" value="cancel">Cancel</button><button class="portal-button ${approve?'':'danger'}" value="confirm">${approve?'Confirm approval':'Confirm rejection'}</button></div></form>`;
  document.body.append(dialog); dialog.showModal(); return new Promise(resolve=>dialog.addEventListener('close',()=>{const reason=dialog.querySelector('#decisionReason').value.trim(),replacementPermitted=!approve&&dialog.querySelector('[data-replacement]').checked,customerSafeReason=approve?'':dialog.querySelector('#customerSafeReason').value.trim();const ok=dialog.returnValue==='confirm'&&reason&&(!approve||dialog.querySelector('[data-attest]').checked)&&(!replacementPermitted||customerSafeReason);dialog.remove();resolve(ok?(approve?{reason}:{reason,replacementPermitted,customerSafeReason:customerSafeReason||undefined}):null);},{once:true}));
}

async function mutate(action) {
  if(busy)return; busy=true; const review=currentCase; const intent=`${review.id}:${action}`; const key=mutationKeys.get(intent)||newIdempotencyKey(action); mutationKeys.set(intent,key);
  try {
    if(action==='assign')await repository.assign(review.id,user.id,key);
    if(action==='unassign')await repository.unassign(review.id,key);
    if(action==='start')await repository.start(review.id,user.id,key);
    if(['approve','reject'].includes(action)){const decision=await decisionDialog(action,review); if(!decision){mutationKeys.delete(intent);return;} await repository[action](review.id,action==='approve'?decision.reason:decision,key);}
    mutationKeys.delete(intent); announce('Finance case updated.'); await renderDetail({refresh:true});
  } catch(error) { if(!error.ambiguous)mutationKeys.delete(intent);if(error.ambiguous||error.status===409||error.status===422){await renderDetail({refresh:true}).catch(()=>{});} setPage(`${heading('Finance case','Action not completed','The case was refreshed where possible. An ambiguous request retains its original idempotency key; review the current state before trying again.')}${errorView(error)}<a class="portal-button secondary" href="${portalUrl('/finance/bank-transfers/details/',{id:review.id})}">Return to case</a>`); }
  finally {busy=false;}
}

async function render(){ try { if(pageName==='overview')await renderOverview(); else if(pageName==='details')await renderDetail(); else await renderQueue(); } catch(error){setPage(`${heading('Finance operations','Unable to load Finance data','Protected content was not displayed.')}${errorView(error)}`);} }

async function initialize(){ user=await requireFinanceAccess(); if(!user)return; repository=createBankTransferRepository(); root.innerHTML=financeShell(user,pageName); await render();
  root.addEventListener('submit',async event=>{if(event.target.matches('[data-filters]')){event.preventDefault();currentPage=0;await renderQueue();} if(event.target.matches('[data-comment]')){event.preventDefault();const textarea=event.target.querySelector('textarea'),comment=textarea.value.trim();if(!comment){textarea.setCustomValidity('Enter an internal comment.');textarea.reportValidity();return;}const key=newIdempotencyKey('comment');try{await repository.comment(currentCase.id,comment,key);textarea.value='';announce('Internal Finance comment added.');}catch(error){setPage(`${heading('Finance comment','Comment not added','The draft has not been persisted by this portal.')}${errorView(error)}`);}}});
  root.addEventListener('change',e=>{if(e.target.matches('[data-status]'))selectedStatus=e.target.value;if(e.target.matches('[data-status],[data-sort],[data-direction]'))currentPage=0;});
  root.addEventListener('click',async event=>{const menu=event.target.closest('.portal-menu-toggle');if(menu){const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('financeNavigation')?.classList.toggle('open',open);}const pg=event.target.closest('[data-page]');if(pg&&!pg.disabled){currentPage=Number(pg.dataset.page);await renderQueue();}if(event.target.closest('[data-refresh]')){repository.clear();await render();}const action=event.target.closest('[data-action]')?.dataset.action;if(action)await mutate(action);if(event.target.closest('[data-open-proof]')){const proofs=await repository.proofs(currentCase.id);try{await openProofViewer(repository,currentCase,proofs[0]);}catch(error){announce(error.message);}}if(event.target.closest('[data-finance-logout]')){closeProofViewer();repository.clear();await authenticationProvider.logout();location.replace(portalUrl('/index.html'));}});
  addEventListener('pagehide',closeProofViewer); document.addEventListener('virtcruise:auth-change',e=>{if(e.detail.status==='guest'){closeProofViewer();repository.clear();}});
}
initialize();
