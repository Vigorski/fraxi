import { IconMarker } from 'components/icons';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { RideWithDriver } from 'types/ride';
import { User } from 'types/user';
import { itemVariants } from 'utilities/constants/framerVariants';

type RideWaypointsOwnProps = {
  allPassengersDetails?: User[];
  rideDetails: RideWithDriver;
};

const RideWaypoints: FC<RideWaypointsOwnProps> = ({
  allPassengersDetails,
  rideDetails,
}) => {
  return (
    <motion.div className="mt-xxl" variants={itemVariants}>
      <h3 className="h3-sm mb-lg">Passengers</h3>
      <ul className="list list__users">
        {allPassengersDetails &&
          allPassengersDetails.map(passenger => {
            const waypoint = rideDetails.route.waypoints?.find(
              waypoint => waypoint.userId === passenger.id,
            );

            return (
              <li key={passenger.userId}>
                <div className="card__icon card__icon--sm">
                  <IconMarker />
                </div>
								<div className='list__users-description'>
									<h5 className='mb-xs'>{`${passenger.name} ${passenger.surname}`}</h5>
									<p>{waypoint?.formatted_address}</p>
								</div>
              </li>
            );
          })}
      </ul>
    </motion.div>
  );
};

export default RideWaypoints;
