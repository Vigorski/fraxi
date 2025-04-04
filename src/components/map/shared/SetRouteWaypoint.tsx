import { FC } from 'react';
import FormAutocomplete from 'components/forms/FormAutocomplete';
import { useAppSelector } from 'hooks/useAppSelector';
import { AcRefType } from 'types/form';
import { Waypoint } from 'types/map';

type SetRouteWaypointOwnProps = {
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  randomProp?: unknown;
};

const SetRouteWaypoint: FC<SetRouteWaypointOwnProps> = ({ setWaypoints }) => {
  const userId = useAppSelector(state => state.user.userDetails?.userId);

  const handleWaypointChange = (acRef: AcRefType) => {
    const place = acRef.current?.getPlace();
    const geoPoint = place?.geometry?.location;
    const formatted_address = place?.formatted_address;
    const lat = geoPoint?.lat();
    const lng = geoPoint?.lng();

    if (!userId || !lat || !lng) {
      throw new Error('An error occured with the application. Please restart');
    }

    setWaypoints(prev => {
      const newWaypoint: Waypoint = {
        userId,
        location: { lat, lng },
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
			className='form-field__map-input'
			labelClassName="form-field__waypoint-label"
			placeholder='Pick up location'
      handler={handleWaypointChange}
    />
  );
};

export default SetRouteWaypoint;
