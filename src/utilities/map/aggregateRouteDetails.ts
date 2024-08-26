import { Place, PlaceResult } from 'types/map';
import { getAddressComponents } from './getAddressComponents';

export function aggregateRouteDetails(place: PlaceResult): Place {
  const lat = place.geometry?.location?.lat();
  const lng = place.geometry?.location?.lng();

  if (!lat || !lng) throw new Error('Error with getting coordinates.');

  return {
    formatted_address: place.formatted_address,
    place_id: place.place_id,
    location: {
      lat,
      lng,
    },
    address_components: getAddressComponents(place),
  };
}
