import { FC } from 'react';
import { Marker } from '@react-google-maps/api';
import markerIcon from 'assets/icons/marker.svg';
import markerIconUnique from 'assets/icons/marker-unique.svg';
import { useAppSelector } from 'hooks/useAppSelector';
import { Waypoint } from 'types/map';

type WaypointMarkersOwnProps = {
  waypoints: Waypoint[];
  handleMarkerClick: (waypoint: Waypoint) => void;
};

const WaypointMarkers: FC<WaypointMarkersOwnProps> = ({
  waypoints,
  handleMarkerClick,
}) => {
  const userId = useAppSelector(state => state.user.userDetails?.userId);

  return waypoints.map(waypoint => {
    if (waypoint.userId === userId) {
      return (
        <Marker
          key={waypoint.userId}
          position={waypoint.location}
          icon={{ url: markerIconUnique }}
          onClick={() => handleMarkerClick(waypoint)}
        />
      );
    }

    return (
      <Marker
        key={waypoint.userId}
        position={waypoint.location}
        icon={{ url: markerIcon }}
        onClick={() => handleMarkerClick(waypoint)}
      />
    );
  });
};

export default WaypointMarkers;
