import { FC } from 'react';
import { Waypoint } from 'types/map';

type ReadonlyRouteWaypointOwnProps = {
  waypoint: Waypoint;
};

const ReadonlyRouteWaypoint: FC<ReadonlyRouteWaypointOwnProps> = ({
  waypoint,
}) => {
  return waypoint.formatted_address ? (
    <div className="form-field form-field--disabled form-field__map-input">
      <label htmlFor="origin" className='form-field__waypoint-label' />
      <input
        type="text"
        id="origin"
        value={waypoint.formatted_address}
        disabled
      />
    </div>
  ) : null;
};

export default ReadonlyRouteWaypoint;
