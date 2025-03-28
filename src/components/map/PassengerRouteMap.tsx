import { FC, useState } from 'react';
import SetRouteWaypoint from './shared/SetRouteWaypoint';
import ReadonlyRouteWaypoint from './shared/ReadonlyRouteWaypoint';
import Map from './shared/Map';
import { useAppSelector } from 'hooks/useAppSelector';
import { Place, Route, Waypoint } from 'types/map';

type PassengerRouteMapOwnProps = {
  originCity?: Place;
  destinationCity?: Place;
  waypoints?: Waypoint[];
  storeRouteMapDetails: (route: Route) => void;
};

const PassengerRouteMap: FC<PassengerRouteMapOwnProps> = ({
  originCity,
  destinationCity,
  waypoints,
  storeRouteMapDetails,
}) => {
  // state only for waypoints. storeRouteMapDetails contains the entire route
  const [newWaypoints, setNewWaypoints] = useState<Waypoint[]>(waypoints || []);
  const userId = useAppSelector(state => state.user.userDetails?.userId);
  const ownWaypoint = waypoints?.find(waypoint => waypoint.userId === userId);

  return (
    <Map
      origin={originCity}
      destination={destinationCity}
      waypoints={newWaypoints}
      parentsCallback={storeRouteMapDetails}>
      {ownWaypoint ? (
        <ReadonlyRouteWaypoint waypoint={ownWaypoint} />
      ) : (
        <SetRouteWaypoint setWaypoints={setNewWaypoints} />
      )}
    </Map>
  );
};

export default PassengerRouteMap;
