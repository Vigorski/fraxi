import { MutableRefObject } from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import { getAddressComponents } from 'utilities/map';
import { SearchRideFormValues } from 'types/ride';
import { AutocompleteType } from 'types/map';

type AcRefType = MutableRefObject<AutocompleteType>;
type FormType = Omit<SearchRideFormValues, 'price'>;
type LocationType = 'origin' | 'destination';
type UseFormContextRouteCitiesReturn<T> = [
  FormikContextType<T>,
  (acRef: AcRefType, location: LocationType) => void,
];

const useFormContextRouteCities = <
  T extends {},
>(): UseFormContextRouteCitiesReturn<T> => {
  const formikProps = useFormikContext<T>();

  const setRouteFieldValue = (acRef: AcRefType, location: LocationType) => {
    const place = acRef.current.getPlace();

    if (place && place.address_components) {
      const city = getAddressComponents(place).city;

      if (city) {
        formikProps.setFieldValue(location, city);
      }
    }
  };

  return [formikProps, setRouteFieldValue];
};

export default useFormContextRouteCities;
