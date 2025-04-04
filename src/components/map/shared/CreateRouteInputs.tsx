import FormAutocomplete from 'components/forms/FormAutocomplete';
import { FC } from 'react';
import { AcRefType } from 'types/form';
import { Place } from 'types/map';
import { aggregateRouteDetails } from 'utilities/map';

type CreateRouteInputsOwnProps = {
  setOrigin: (origin: Place) => void;
  setDestination: (origin: Place) => void;
};

const CreateRouteInputs: FC<CreateRouteInputsOwnProps> = ({
  setOrigin,
  setDestination,
}) => {
  const handleOriginChange = (acRef: AcRefType) => {
    const place = acRef.current?.getPlace();
    if (place) {
      setOrigin(aggregateRouteDetails(place));
    }
  };

  const handleDestinationChange = (acRef: AcRefType) => {
    const place = acRef.current?.getPlace();
    if (place) {
      setDestination(aggregateRouteDetails(place));
    }
  };

  return (
    <>
      <FormAutocomplete
        name="origin"
				className='form-field__map-input'
        labelClassName="form-field__origin-label"
				placeholder='Origin'
        handler={handleOriginChange}
				/>
      <FormAutocomplete
        name="destination"
				className='form-field__map-input'
        labelClassName="form-field__destination-label"
				placeholder='Destination'
        handler={handleDestinationChange}
      />
    </>
  );
};

export default CreateRouteInputs;
