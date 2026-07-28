export const defaultTrip = () => ({
  tripTitle: 'My Virtcruise Trip',
  tripStartDate: '',
  tripEndDate: '',
  origin: '',
  destination: ''
});

export function normaliseTrip(state) {
  const trip = defaultTrip();
  Object.keys(trip).forEach(key => {
    if (state?.[key] !== undefined && state[key] !== null) trip[key] = state[key];
  });
  return trip;
}

export function updateTrip(state, values = {}) {
  Object.keys(defaultTrip()).forEach(key => {
    if (values[key] !== undefined) state[key] = values[key];
  });
  return normaliseTrip(state);
}
