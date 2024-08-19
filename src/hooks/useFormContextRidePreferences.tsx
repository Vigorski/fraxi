import { FormikContextType, useFormikContext } from 'formik';
import { getAddressComponents } from 'utilities/map';
import { AcRefType } from 'types/form';
import { RidePreferences } from 'types/ride';

type LocationArg<T> = Extract<keyof T, 'origin' | 'destination'>;
type SetLocation<T> = (acRef: AcRefType, location: LocationArg<T>) => void;
type FormContextReturn<T> = [
  FormikContextType<T>,
  SetLocation<T>
];

const useFormContextRidePreferences = <
  T extends RidePreferences,
>(): FormContextReturn<T> => {
  const formikProps = useFormikContext<T>();

  const setLocation = (acRef: AcRefType, location: LocationArg<T>) => {
    const place = acRef.current?.getPlace();

    if (place && place.address_components) {
      const city = getAddressComponents(place).city;

      if (city) {
        formikProps.setFieldValue(location, city);
      }
    }
  };

  return [formikProps, setLocation];
};

export default useFormContextRidePreferences;
