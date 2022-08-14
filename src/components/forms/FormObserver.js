import { useEffect } from 'react';
import { useFormikContext } from 'formik';

const FormObserver = ({handleObserverValues}) => {
  const { values } = useFormikContext();
  
  useEffect(() => {
    handleObserverValues(values);
  }, [values, handleObserverValues]);

  return null;
};

export default FormObserver;