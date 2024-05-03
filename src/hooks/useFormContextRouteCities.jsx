import { useFormikContext } from 'formik';
import { getAddressComponents } from 'utilities/map';

const useFormContextRouteCities = () => {
  const formikProps = useFormikContext();

  const setRouteFieldValue = (acRef, location) => {
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
