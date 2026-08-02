const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CASE_STATES = new Set(['NEW','AWAITING_UPLOAD','AWAITING_REPLACEMENT','PROOF_RECEIVED','UNDER_REVIEW','APPROVED','REJECTED','EXPIRED','CANCELLED']);
const CASE_PROOF_STATES = new Set(['NOT_RECEIVED','RECEIVED']);
const PROOF_STATES = new Set(['QUARANTINED','SCANNING','ACCEPTED','SUPERSEDED','REJECTED','SCAN_FAILED','DELETED','EXPIRED']);
const text = (value, field, max = 500) => { if (typeof value !== 'string' || !value || value.length > max) throw new TypeError(`Invalid ${field}`); return value; };
const uuid = (value, field) => { if (!UUID.test(value || '')) throw new TypeError(`Invalid ${field}`); return value; };
const instant = (value, field) => { if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new TypeError(`Invalid ${field}`); return value; };

export function reviewCaseDto(value) {
  if (!value || typeof value !== 'object') throw new TypeError('Invalid review case');
  if (!CASE_STATES.has(value.reviewStatus) || !CASE_PROOF_STATES.has(value.proofStatus) || typeof value.slaBreached !== 'boolean' || !Number.isSafeInteger(value.version)) throw new TypeError('Invalid review case state');
  return Object.freeze({
    id: uuid(value.id,'case id'), customerId: uuid(value.customerId,'customer id'), bookingId: uuid(value.bookingId,'booking id'), invoiceId: uuid(value.invoiceId,'invoice id'),
    currency: text(value.currency,'currency',3), amount: text(String(value.amount),'amount',100), bankAccount: text(value.bankAccount,'bank account',100),
    transferReference: text(value.transferReference,'transfer reference',100), proofStatus: text(value.proofStatus,'proof status',40), reviewStatus: value.reviewStatus,
    reviewerId: value.reviewerId == null ? null : uuid(value.reviewerId,'reviewer id'), slaDueAt: instant(value.slaDueAt,'SLA due time'), slaBreached: value.slaBreached,
    decisionReason: value.decisionReason == null ? null : text(value.decisionReason,'decision reason'), createdAt: instant(value.createdAt,'created time'), updatedAt: instant(value.updatedAt,'updated time'), version: value.version
  });
}

export function proofDto(value) {
  if (!value || typeof value !== 'object' || !PROOF_STATES.has(value.status) || !Number.isSafeInteger(value.size) || value.size < 0 || !['application/pdf','image/jpeg','image/png'].includes(value.mediaType)) throw new TypeError('Invalid proof metadata');
  return Object.freeze({ id: uuid(value.id,'proof id'), reviewCaseId: uuid(value.reviewCaseId,'case id'), fileName: text(value.fileName,'filename',255), mediaType: text(value.mediaType,'media type',100), size: value.size,
    checksum: text(value.checksum,'checksum',128), status: value.status, scanStatus: text(value.scanStatus,'scan status',40), retentionUntil: value.retentionUntil == null ? null : instant(value.retentionUntil,'retention'), createdAt: instant(value.createdAt,'upload time'), acceptedAt: value.acceptedAt == null ? null : instant(value.acceptedAt,'acceptance time') });
}

export function pageDto(value) {
  if (!value || !Array.isArray(value.content) || !Number.isSafeInteger(value.page) || !Number.isSafeInteger(value.totalPages) || !Number.isSafeInteger(value.totalElements)) throw new TypeError('Invalid queue page');
  return Object.freeze({ items: value.content.map(reviewCaseDto), page: value.page, size: value.size, totalElements: value.totalElements, totalPages: value.totalPages, first: Boolean(value.first), last: Boolean(value.last) });
}

export const canOpenProof = proof => proof?.status === 'ACCEPTED' && proof.scanStatus === 'CLEAN' && ['application/pdf','image/jpeg','image/png'].includes(proof.mediaType);
export const isTerminal = review => ['APPROVED','REJECTED','EXPIRED','CANCELLED'].includes(review.reviewStatus);
export const newIdempotencyKey = operation => `finance-${operation}-${crypto.randomUUID()}`;
