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

export function getAddressComponents(marker) {
	const addressComponents = {};
	marker.address_components.forEach(component => {
		if (component.types.includes('street_number')) {
			addressComponents.street = component.long_name;
		} else if (component.types.includes('route')) {
			addressComponents.street += ' ' + component.long_name;
		} else if (component.types.includes('locality')) {
			addressComponents.city = component.long_name;
		} else if (component.types.includes('postal_code')) {
			addressComponents.postalCode = component.long_name;
		}
	});

	return addressComponents;
}

export function aggregateRouteDetails(point) {
	return { 
		formatted_address: point.formatted_address,
		place_id: point.place_id,
		location: {
			lat: point.geometry.location.lat(),
			lng: point.geometry.location.lng()
		},
		address_components: getAddressComponents(point),
	}
}