import { Marker } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import markerIcon from 'assets/icons/marker.svg';
import markerIconUnique from 'assets/icons/marker-unique.svg';

const WaypointMarkers = ({ waypoints, handleMarkerClick }) => {
  const { userId } = useSelector(state => state.user.userDetails);

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
