import { FC, useState } from 'react';
import CreateRouteInputs from './shared/CreateRouteInputs';
import ReadonlyRouteInputs from './shared/ReadonlyRouteInputs';
import Map from './shared/Map';
import GoogleMapsLoader from 'components/shared/GoogleMapsLoader';
import { Place, Route, Waypoint } from 'types/map';

type DriverRouteMapOwnProps = {
  originCity?: Place;
  destinationCity?: Place;
  waypoints?: Waypoint[];
  storeRouteMapDetails?: (args: Route) => void;
};

const DriverRouteMap: FC<DriverRouteMapOwnProps> = ({
  originCity,
  destinationCity,
  waypoints,
  storeRouteMapDetails,
}) => {
  const [origin, setOrigin] = useState<Place | undefined>(originCity);
  const [destination, setDestination] = useState<Place | undefined>(destinationCity);

  return (
    <GoogleMapsLoader>
      <Map
        origin={origin}
        destination={destination}
        waypoints={waypoints}
        parentsCallback={storeRouteMapDetails}>
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
