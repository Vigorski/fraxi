import { AddressComponentsRefined } from 'types/map';
import { getAddressComponents } from './getAddressComponents';

type AggregateRouteDetails = {
  formatted_address?: string;
  place_id?: string;
  location: {
    lat?: number;
    lng?: number;
  };
  address_components: AddressComponentsRefined;
}

export function aggregateRouteDetails(place: google.maps.places.PlaceResult): AggregateRouteDetails {
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
