import { canOpenProof } from './finance-model.js';

let activeUrl = null, activeController = null;
export function closeProofViewer() {
  activeController?.abort(); activeController=null;
  if(activeUrl) URL.revokeObjectURL(activeUrl); activeUrl=null;
  document.getElementById('proofViewer')?.remove();
}
export async function openProofViewer(repository, review, proof) {
  closeProofViewer();
  if(!canOpenProof(proof)) throw new Error('Only accepted, clean PDF, JPEG, or PNG evidence can be opened.');
  activeController=new AbortController();
  const result=await repository.download(review.id,proof.id,activeController.signal);
  if(result.blob.type && result.blob.type!==proof.mediaType) throw new Error('The downloaded proof type did not match its trusted metadata.');
  activeUrl=URL.createObjectURL(result.blob);
  const dialog=document.createElement('dialog'); dialog.id='proofViewer'; dialog.className='proof-dialog'; dialog.setAttribute('aria-labelledby','proofViewerTitle');
  const media=proof.mediaType==='application/pdf'?`<iframe title="Proof PDF: ${proof.fileName.replace(/["&<>]/g,'')}" src="${activeUrl}"></iframe>`:`<img src="${activeUrl}" alt="Proof of payment evidence: ${proof.fileName.replace(/["&<>]/g,'')}">`;
  dialog.innerHTML=`<div class="proof-dialog-head"><div><p class="portal-eyebrow">Evidence — not confirmation of cleared funds</p><h2 id="proofViewerTitle"></h2></div><button type="button" data-close-proof aria-label="Close proof viewer">Close</button></div><div class="proof-media">${media}</div>`;
  dialog.querySelector('h2').textContent=proof.fileName; document.body.append(dialog); dialog.addEventListener('close',closeProofViewer,{once:true}); dialog.querySelector('[data-close-proof]').addEventListener('click',()=>dialog.close()); dialog.showModal();
}
