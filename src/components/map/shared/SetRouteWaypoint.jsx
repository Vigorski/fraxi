import { useSelector } from 'react-redux';
import FormAutocomplete from 'components/forms/FormAutocomplete';

const SetRouteWaypoint = ({ setWaypoints, randomProp }) => {
  const { userId } = useSelector(state => state.user.userDetails);

  const handleWaypointChange = acRef => {
    const place = acRef.current.getPlace();
    const geoPoint = place.geometry.location;
    const formatted_address = place.formatted_address;
    const location = {
      lat: geoPoint.lat(),
      lng: geoPoint.lng(),
    };

    setWaypoints(prev => {
      const newWaypoint = {
        userId,
        location,
        formatted_address,
        stopover: true,
      };

      const waypointIndex = prev.findIndex(
        waypoint => waypoint.userId === userId,
      );

      if (waypointIndex < 0) {
        return [...prev, newWaypoint];
      } else {
        return [
          ...prev.slice(0, waypointIndex),
          newWaypoint,
          ...prev.slice(waypointIndex + 1),
        ];
      }
    });
  };

  return (
    <FormAutocomplete
      name="waypoint"
      label="Pick up location"
      handler={handleWaypointChange}
    />
  );
};

export default SetRouteWaypoint;
