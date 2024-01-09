export function throttle(fn, delay) {
	let handle = null;
	let prevArgs = undefined;

	return function () {
		prevArgs = arguments;
		if (!handle) {
			fn(...prevArgs);
			prevArgs = null;
			handle = setInterval(() => {
				if (!prevArgs) {
					handle = clearInterval(handle);
				} else {
					fn(...prevArgs);
					prevArgs = null;
				}
			}, delay);
		}
	};
}