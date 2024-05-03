import { aggregateRouteDetails } from 'utilities/map';
import FormAutocomplete from 'components/forms/FormAutocomplete';

const CreateRouteInputs = ({ setOrigin, setDestination }) => {
  const handleOriginChange = acRef => {
    setOrigin(aggregateRouteDetails(acRef.current.getPlace()));
  };

  const handleDestinationChange = acRef => {
    setDestination(aggregateRouteDetails(acRef.current.getPlace()));
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
