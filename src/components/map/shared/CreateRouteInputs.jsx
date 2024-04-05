import { useEffect, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import {
  aggregateRouteDetails,
  removeAutocompletePacContainer,
} from 'utilities/map';

const CreateRouteInputs = ({ setOrigin, setDestination }) => {
  const originObjRef = useRef(null);
  const destinationObjRef = useRef(null);

  const handleOriginChange = () => {
    setOrigin(aggregateRouteDetails(originObjRef.current.getPlace()));
  };

  const handleDestinationChange = () => {
    setDestination(aggregateRouteDetails(destinationObjRef.current.getPlace()));
  };

  useEffect(() => {
    return () => {
      removeAutocompletePacContainer(originObjRef.current);
      removeAutocompletePacContainer(destinationObjRef.current);
    };
  }, []);

  return (
    <>
      <div className="form-field">
        <label htmlFor="origin">Origin</label>
        <Autocomplete
          onLoad={ac => {
            originObjRef.current = ac;
          }}
          onPlaceChanged={handleOriginChange}>
          <input type="text" id="origin" placeholder="Enter origin" />
        </Autocomplete>
      </div>
      <div className="form-field">
        <label htmlFor="destination">Destination</label>
        <Autocomplete
          onLoad={ac => {
            destinationObjRef.current = ac;
          }}
          onPlaceChanged={handleDestinationChange}>
          <input type="text" id="destination" placeholder="Enter destination" />
        </Autocomplete>
      </div>
    </>
  );
};

export default CreateRouteInputs;
