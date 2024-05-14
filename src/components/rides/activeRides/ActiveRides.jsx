import { motion } from 'framer-motion';
import { itemVariants } from 'utilities/constants/framerVariants';
import ActiveRideCard from './ActiveRideCard';

const ActiveRides = ({ activeRides }) => {
  if (activeRides?.length > 0) {
    return activeRides.map(ride => (
      <ActiveRideCard ride={ride} key={ride.id} />
    ));
  }

  return (
    <motion.h4 variants={itemVariants}>
      There are no active rides at the moment
    </motion.h4>
  );
};

export default ActiveRides;
