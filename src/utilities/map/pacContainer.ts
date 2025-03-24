import { ExtendedAutocompleteType } from "types/map";

// The pac-container element comes from google
// As of yet, there is an unresolved bug with this element
// where it is duplocated every time the autocomplete is being used
// this is a crude way of removing the duplications.

export const getAutocompletePacContainer = (autocomplete: ExtendedAutocompleteType | null) => {
  if (!autocomplete) return null;

  const place = autocomplete.gm_accessors_.place;
  const placeKey = Object.keys(place).find(
    value =>
      typeof place[value] === 'object' &&
      place[value].hasOwnProperty('gm_accessors_'),
  );

  if (!placeKey) return null;

  const input = place[placeKey].gm_accessors_.input[placeKey];

  const inputKey = Object.keys(input).find(
    value =>
      input[value].classList &&
      input[value].classList.contains('pac-container'),
  );

  if (!inputKey) return null;

  return input[inputKey] ?? null;
};

export const removeAutocompletePacContainer = (autocomplete: ExtendedAutocompleteType) => {
  getAutocompletePacContainer(autocomplete)?.remove();
};

export const removeAutocompletePacContainersDevMode = () => {
  const pacContainers = document.querySelectorAll('.pac-container');
  
  pacContainers.forEach((container) => {
    container.remove();
  });
};
