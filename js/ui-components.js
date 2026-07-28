const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

export function statusBadge(status, label = status) {
  const safeStatus = String(status || 'unknown').toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return `<span class="ui-status-badge ui-status-${safeStatus}">${escapeHtml(label)}</span>`;
}

export function loadingState(message = 'Loading…') {
  return `<div class="ui-state ui-loading" role="status"><span aria-hidden="true"></span><p>${escapeHtml(message)}</p></div>`;
}

export function emptyState(title, message, actionMarkup = '') {
  return `<div class="ui-state ui-empty"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p>${actionMarkup}</div>`;
}

export function errorState(message, retryAction = '') {
  return `<div class="ui-state ui-error" role="alert"><h3>Something went wrong</h3><p>${escapeHtml(message)}</p>${retryAction ? `<button type="button" data-retry="${escapeHtml(retryAction)}">Try again</button>` : ''}</div>`;
}

export function confirmationDialog({
  id,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}) {
  return `<dialog class="ui-confirmation" id="${escapeHtml(id)}" aria-labelledby="${escapeHtml(id)}-title">
    <form method="dialog"><h2 id="${escapeHtml(id)}-title">${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p>
    <div><button value="cancel">${escapeHtml(cancelLabel)}</button><button class="app-primary" value="confirm">${escapeHtml(confirmLabel)}</button></div></form>
  </dialog>`;
}

export function dataTable({ caption, columns = [], rows = [], rowKey = 'id' }) {
  const headings = columns.map(column => `<th scope="col">${escapeHtml(column.label)}</th>`).join('');
  const body = rows.map(row => `<tr data-row-id="${escapeHtml(row[rowKey])}">${
    columns.map(column => `<td>${escapeHtml(row[column.key] ?? '—')}</td>`).join('')
  }</tr>`).join('');
  return `<div class="ui-table-wrap"><table class="ui-data-table"><caption>${escapeHtml(caption)}</caption><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function filterBar({ label = 'Filter results', filters = [] }) {
  return `<form class="ui-filter-bar" role="search" aria-label="${escapeHtml(label)}">${
    filters.map(filter => `<label>${escapeHtml(filter.label)}<select name="${escapeHtml(filter.name)}">${
      (filter.options || []).map(option => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join('')
    }</select></label>`).join('')
  }</form>`;
}
