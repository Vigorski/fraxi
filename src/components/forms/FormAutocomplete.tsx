import { FC, useEffect, useRef } from 'react';
import { removeAutocompletePacContainer } from 'utilities/map';
import { AutocompleteType, ExtendedAutocompleteType } from 'types/map';
import { Autocomplete } from '@react-google-maps/api';
import { AcRefType } from 'types/form';
import { removeAutocompletePacContainersDevMode } from 'utilities/map/pacContainer';
import { motion } from 'framer-motion';
import { itemVariants } from 'utilities/constants/framerVariants';

type FormAutocompleteOwnProps = {
  name: string;
  label?: string;
	labelClassName?: string;
  handler: (acRef: AcRefType) => void;
  placeholder?: string;
  className?: string;
  types?: string[];
};

const FormAutocomplete: FC<FormAutocompleteOwnProps> = ({
  name,
  label,
	labelClassName,
  handler,
  placeholder,
  className,
  ...rest
}) => {
  const acRef = useRef<AutocompleteType | null>(null);

  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        removeAutocompletePacContainersDevMode();
      } else {
        removeAutocompletePacContainer(acRef.current as ExtendedAutocompleteType);
      }
    }
  }, []);

  return (
    <motion.div variants={itemVariants} className={`form-field ${className ?? ''}`}>
      <label className={labelClassName ?? ''} htmlFor={name}>{label ?? ''}</label>
			<Autocomplete
				className='form-field__autocomplete'
				onLoad={ac => {
					acRef.current = ac;
				}}
				onPlaceChanged={handler.bind(null, acRef)}
				options={{ componentRestrictions: { country: 'mk' } }}
				{...rest}>
				<input type="text" id={name} placeholder={placeholder ?? label} />
			</Autocomplete>
    </motion.div>
  );
};

export default FormAutocomplete;
