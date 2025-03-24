import { FC } from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from 'utilities/constants/framerVariants';
import { RideWithDriver } from 'types/ride';
import RideResultsCard from './RideResultsCard';

type RideResultsOwnProps = {
  filteredRides: RideWithDriver[];
};

const RideResults: FC<RideResultsOwnProps> = ({ filteredRides }) => {
  return filteredRides.length > 0 ? (
    <div className="card__wrapper">
      {filteredRides.map((ride, index) => (
        <motion.div
          variants={itemVariants}
          transition={{ delay: 0.1 * index }}
          key={ride.rideId}>
          <RideResultsCard ride={ride} />
        </motion.div>
      ))}
    </div>
  ) : (
    <motion.h2 variants={itemVariants} className="h2-sm">
      No rides match your preferences
    </motion.h2>
  );
};

export default RideResults;
