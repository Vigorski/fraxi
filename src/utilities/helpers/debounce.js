export function debounce(fn, delay) {
  let lastFn;
  const _this = this;

  return function (...args) {
    clearTimeout(lastFn);
    lastFn = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  };
}
