import { motion } from 'framer-motion';
import RideResultsCard from './RideResultsCard';
import { itemVariants } from 'utilities/constants/framerVariants';

const RideResults = ({ filteredRides }) => {
  return filteredRides.length > 0 ? (
    <div className="card__wrapper">
      {/* // TODO: fix error when selecting same city */}
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
