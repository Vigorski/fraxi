export const debounce = function (fn, delay) {
  let lastFn;
  const _this = this;
console.log('inside debounce')
  return function (...args) {
    clearTimeout(lastFn);
    lastFn = setTimeout(() => {
      fn.apply(_this, args);
    }, delay)
  }
}

export const throttle = function (fn, delay) {
  let handle = null
  let prevArgs = undefined
  
  return function() {
    prevArgs = arguments
    if (!handle) {
      fn(...prevArgs)
      prevArgs = null
      handle = setInterval(() => {
        if (!prevArgs) {
          handle = clearInterval(handle)
        } else {
          fn(...prevArgs)
          prevArgs = null
        }
      }, delay)
    }
  }
}