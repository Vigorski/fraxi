import React, { useState } from 'react';
import CreateRouteInputs from './shared/CreateRouteInputs';
import ReadonlyRouteInputs from './shared/ReadonlyRouteInputs';
import Map from './shared/Map';
import GoogleMapsLoader from 'components/shared/GoogleMapsLoader';

const DriverRouteMap = ({
  originCity,
  destinationCity,
  waypoints,
  storeRouteMapDetails,
}) => {
  const [origin, setOrigin] = useState(originCity ?? null);
  const [destination, setDestination] = useState(destinationCity ?? null);

  return (
    <GoogleMapsLoader>
      <Map
        origin={origin}
        destination={destination}
        waypoints={waypoints}
        directionsCallback={storeRouteMapDetails}>
        {originCity && destinationCity ? (
          <ReadonlyRouteInputs
            origin={originCity}
            destination={destinationCity}
          />
        ) : (
          <CreateRouteInputs
            setOrigin={setOrigin}
            setDestination={setDestination}
          />
        )}
      </Map>
    </GoogleMapsLoader>
  );
};

export default DriverRouteMap;
