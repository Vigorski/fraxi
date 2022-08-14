import { useEffect } from 'react';
import { useFormikContext } from 'formik';

const FormObserver = () => {
  const { values } = useFormikContext();
  
  useEffect(() => {
    console.log("FormObserver::values", values);
  }, [values]);

  return null;
};

export default FormObserver;