import { useEffect, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { IconDirection } from 'components/icons';
import { removeAutocompletePacContainer } from 'utilities/map';

const FormAutocomplete = ({
  name,
  label,
  handler,
  placeholder,
  className,
  ...rest
}) => {
  const acRef = useRef(null);

  useEffect(() => {
    return () => {
      removeAutocompletePacContainer(acRef.current);
    };
  }, []);

  return (
    <div className={`form-field ${className ?? ''}`}>
      <label htmlFor={name}>{label}</label>
      <div className="form-field__icon">
        <IconDirection />
        <Autocomplete
          onLoad={ac => {
            acRef.current = ac;
          }}
          onPlaceChanged={handler.bind(null, acRef)}
          options={{ componentRestrictions: { country: 'mk' } }}
          {...rest}>
          <input type="text" id={name} placeholder={placeholder ?? label} />
        </Autocomplete>
      </div>
    </div>
  );
};

export default FormAutocomplete;
