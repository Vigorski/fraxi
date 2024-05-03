import { useEffect } from 'react';
import { useFormikContext } from 'formik';

// FormObserver is being used in cases where onSubmit is not applicable.
// It simply observes the values object from the form it is being used in
// and calls the passed handler with those values
const FormObserver = ({ handleObserverValues }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    handleObserverValues(values);
  }, [values, handleObserverValues]);

  return null;
};

export default FormObserver;
