export function debounce(callback, delay = 240) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

export function searchableText(...values) {
  return values.flat(Infinity).filter(Boolean).join(' ').toLocaleLowerCase();
}
