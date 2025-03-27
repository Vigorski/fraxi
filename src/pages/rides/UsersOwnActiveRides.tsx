import { motion } from 'framer-motion';
import ActiveRides from 'components/rides/activeRides/ActiveRides';
import { mainContainerVariants } from 'utilities/constants/framerVariants';
import { useAppSelector } from 'hooks/useAppSelector';

const UsersOwnActiveRides = () => {
  const { activeRides } = useAppSelector(state => state.rides);

  return (
    <motion.section
      className="active-rides"
      variants={mainContainerVariants}
      initial="initial"
      animate="visible"
      exit="hidden">
      <div className="card__wrapper">
        <ActiveRides activeRides={activeRides} />
      </div>
    </motion.section>
  );
};

export default UsersOwnActiveRides;
