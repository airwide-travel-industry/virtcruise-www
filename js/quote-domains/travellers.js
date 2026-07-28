import { asNumber } from './shared.js';

export const defaultTravellers = () => ({ adults: 1, children: 0, infants: 0 });

export function normaliseTravellers(values = {}) {
  return {
    adults: Math.max(0, asNumber(values.adults, 1)),
    children: Math.max(0, asNumber(values.children)),
    infants: Math.max(0, asNumber(values.infants))
  };
}

export function updateTravellers(state, values = {}) {
  state.travellerCounts = normaliseTravellers({ ...state.travellerCounts, ...values });
  return state.travellerCounts;
}

export function totalTravellers(state) {
  const counts = normaliseTravellers(state.travellerCounts);
  return Math.max(1, counts.adults + counts.children + counts.infants);
}
