import { FC } from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from 'utilities/constants/framerVariants';
import { Ride } from 'types/ride';
import ActiveRideCard from './ActiveRideCard';

type ActiveRidesOwnProps = {
  activeRides: Ride[];
};

const ActiveRides: FC<ActiveRidesOwnProps> = ({ activeRides }) => {
  if (activeRides?.length > 0) {
    return activeRides.map(ride => (
      <ActiveRideCard ride={ride} key={ride.rideId} />
    ));
  }

  return (
    <motion.h4 variants={itemVariants}>
      There are no active rides at the moment
    </motion.h4>
  );
};

export default ActiveRides;
