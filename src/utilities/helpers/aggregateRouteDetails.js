import { getAddressComponents } from "./getAddressComponents";

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