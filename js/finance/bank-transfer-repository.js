import { financeRequest } from './finance-api.js';
import { pageDto, proofDto, reviewCaseDto } from './finance-model.js';

const BASE = '/api/v1/bank-transfer/reviews';
export function createBankTransferRepository() {
  const cache = new Map(), inflight = new Map(); let generation = 0;
  const read = (key, loader, ttl = 8_000) => {
    const hit = cache.get(key); if (hit && hit.expires > Date.now()) return Promise.resolve(hit.value);
    if (inflight.has(key)) return inflight.get(key);
    const expected = generation;
    const promise = loader().then(value => { if (generation === expected) cache.set(key,{ value, expires: Date.now() + ttl }); return value; }).finally(() => inflight.delete(key));
    inflight.set(key,promise); return promise;
  };
  const mutate = async (path, options, validate = reviewCaseDto) => { const value = validate(await financeRequest(path, options)); clear(); return value; };
  const clear = () => { generation += 1; cache.clear(); };
  return Object.freeze({
    clear,
    list(options = {}) { const query = new URLSearchParams(); Object.entries(options).forEach(([k,v]) => { if (v !== '' && v != null) query.set(k,v); }); const key = `list:${query}`; return read(key,() => financeRequest(`${BASE}?${query}`).then(pageDto)); },
    get(id,{ refresh=false }={}) { const key=`case:${id}`; if(refresh) cache.delete(key); return read(key,() => financeRequest(`${BASE}/${encodeURIComponent(id)}`).then(reviewCaseDto)); },
    proofs(id,{ refresh=false }={}) { const key=`proofs:${id}`; if(refresh) cache.delete(key); return read(key,() => financeRequest(`${BASE}/${encodeURIComponent(id)}/proofs`).then(items => { if(!Array.isArray(items)) throw new TypeError('Invalid proofs'); return items.map(proofDto); })); },
    download(caseId,proofId,signal) { return financeRequest(`${BASE}/${encodeURIComponent(caseId)}/proofs/${encodeURIComponent(proofId)}`,{ responseType:'blob',signal }); },
    assign(id,reviewerId,key) { return mutate(`${BASE}/${encodeURIComponent(id)}/assign`,{method:'POST',body:{reviewerId},idempotencyKey:key}); },
    unassign(id,key) { return mutate(`${BASE}/${encodeURIComponent(id)}/assignment`,{method:'DELETE',idempotencyKey:key}); },
    start(id,reviewerId,key) { return mutate(`${BASE}/${encodeURIComponent(id)}/review`,{method:'POST',body:{reviewerId},idempotencyKey:key}); },
    approve(id,reason,key) { return mutate(`${BASE}/${encodeURIComponent(id)}/approve`,{method:'POST',body:{reason},idempotencyKey:key}); },
    reject(id,reason,key) { return mutate(`${BASE}/${encodeURIComponent(id)}/reject`,{method:'POST',body:{reason},idempotencyKey:key}); },
    comment(id,comment,key) { return mutate(`${BASE}/${encodeURIComponent(id)}/comments`,{method:'POST',body:{comment},idempotencyKey:key},value => value); }
  });
}
