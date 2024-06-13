// The pac-container element comes from google
// As of yet, there is an unresolved bug with this element
// where it is duplocated every time the autocomplete is being used
// this is a crude way of removing the duplications.
// TODO: create custom Autocomplete component using Places API instead
export const getAutocompletePacContainer = (autocomplete: HTMLElement) => {
  const place = (autocomplete as any).gm_accessors_.place;
  const placeKey = Object.keys(place).find(
    value =>
      typeof place[value] === 'object' &&
      place[value].hasOwnProperty('gm_accessors_'),
  );

  if (!placeKey) return;

  const input = place[placeKey].gm_accessors_.input[placeKey];

  const inputKey = Object.keys(input).find(
    value =>
      input[value].classList &&
      input[value].classList.contains('pac-container'),
  );

  if (!inputKey) return;

  return input[inputKey];
};

export const removeAutocompletePacContainer = (autocomplete: HTMLElement) => {
  getAutocompletePacContainer(autocomplete).remove();
};
