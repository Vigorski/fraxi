export const getAutocompletePacContainer = (autocomplete) => {
    const place = autocomplete.gm_accessors_.place;
    const placeKey = Object.keys(place).find((value) => (
        (typeof (place[value]) === 'object') && (place[value].hasOwnProperty('gm_accessors_'))
    ));

    const input = place[placeKey].gm_accessors_.input[placeKey];

    const inputKey = Object.keys(input).find((value) => (
        (input[value].classList && input[value].classList.contains('pac-container'))
    ));

    return input[inputKey];
}


export const removeAutocompletePacContainer = (autocomplete) => {
    getAutocompletePacContainer(autocomplete).remove();
}