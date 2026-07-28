export function updateSpecialRequests(state, notes = '') {
  state.overallNotes = String(notes);
  return state.overallNotes;
}
