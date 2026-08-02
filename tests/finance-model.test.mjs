import test from 'node:test'; import assert from 'node:assert/strict';
import { reviewCaseDto,proofDto,pageDto,canOpenProof,isTerminal,newIdempotencyKey } from '../js/finance/finance-model.js';
import { cases,proofs } from './fixtures/finance-api.mjs';

test('maps only accepted review and pagination fields',()=>{const page=pageDto(cases.paginated);assert.equal(page.items[0].amount,'12500.00');assert.equal(page.totalElements,3);assert.throws(()=>reviewCaseDto({...cases.approved,customerName:'Invented',reviewStatus:'PAID'}));});
test('preserves materially different case terminal states',()=>{for(const state of ['APPROVED','REJECTED','EXPIRED','CANCELLED'])assert.equal(isTerminal(reviewCaseDto(cases[state.toLowerCase()])),true);assert.equal(isTerminal(reviewCaseDto(cases.underReview)),false);});
test('opens only accepted clean allowlisted proofs',()=>{for(const value of [proofs.pdf,proofs.jpeg,proofs.png])assert.equal(canOpenProof(proofDto(value)),true);for(const value of [proofs.scanning,proofs.rejected,proofs.scanFailed])assert.equal(canOpenProof(proofDto(value)),false);});
test('accepts replacement lifecycle states without making superseded proof openable',()=>{assert.equal(reviewCaseDto({...cases.underReview,reviewStatus:'AWAITING_REPLACEMENT'}).reviewStatus,'AWAITING_REPLACEMENT');assert.equal(canOpenProof(proofDto({...proofs.pdf,status:'SUPERSEDED'})),false);});
test('rejects executable and malformed proof DTOs',()=>{assert.throws(()=>proofDto({...proofs.pdf,mediaType:'image/svg+xml'}));assert.throws(()=>proofDto({...proofs.pdf,size:-1}));});
test('generates stable operation-scoped keys per intended mutation',()=>{const key=newIdempotencyKey('approve');assert.match(key,/^finance-approve-[0-9a-f-]+$/);assert.equal(key,key);assert.notEqual(newIdempotencyKey('approve'),key);});
