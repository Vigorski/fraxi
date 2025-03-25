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
        label="Origin"
        handler={handleOriginChange}
      />
      <FormAutocomplete
        name="destination"
        label="Destination"
        handler={handleDestinationChange}
      />
    </>
  );
};

export default CreateRouteInputs;
