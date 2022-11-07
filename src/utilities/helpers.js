export const debounce = (func, limit) => {
  let lastFunc;
  const context = this;

  return function (...args) {
    clearTimeout(lastFunc);
    lastFunc = setTimeout(() => {
      func.apply(context, args);
    }, limit)
  }
}