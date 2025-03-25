import { AddressComponents, PlaceResult } from 'types/map';

export function getAddressComponents(place: PlaceResult) {
  const addressComponents: AddressComponents = {};

  if (!place.address_components) {
    throw new Error('');
  }

  place.address_components.forEach(component => {
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
