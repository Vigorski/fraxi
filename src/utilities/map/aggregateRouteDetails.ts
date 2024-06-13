import { getAddressComponents } from './getAddressComponents';

export function aggregateRouteDetails(place: google.maps.places.PlaceResult) {
  return {
    formatted_address: place.formatted_address,
    place_id: place.place_id,
    location: {
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng(),
    },
    address_components: getAddressComponents(place),
  };
}
