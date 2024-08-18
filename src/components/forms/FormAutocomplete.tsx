import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { IconDirection } from 'components/icons';
import { removeAutocompletePacContainer } from 'utilities/map';
import { AutocompleteType, ExtendedAutocompleteType } from 'types/map';
import { Autocomplete } from '@react-google-maps/api';

type FormAutocompleteOwnProps = {
  name: string;
  label: string;
  handler: (acRef: MutableRefObject<AutocompleteType | null>) => void;
  placeholder: string;
  className: string;
  types?: string[];
}

const FormAutocomplete: FC<FormAutocompleteOwnProps> = ({
  name,
  label,
  handler,
  placeholder,
  className,
  ...rest
}) => {
  const acRef = useRef<AutocompleteType | null>(null);

  useEffect(() => {
    return () => {
      removeAutocompletePacContainer(acRef.current as ExtendedAutocompleteType);
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
