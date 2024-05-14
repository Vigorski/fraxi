export function getAddressComponents(place) {
  const addressComponents = {};
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
