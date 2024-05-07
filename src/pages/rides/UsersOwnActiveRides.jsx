import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import ActiveRides from 'components/rides/activeRides/ActiveRides';
import { mainContainerVariants } from 'utilities/constants/framerVariants';

const UsersOwnActiveRides = () => {
  const { activeRides } = useSelector(state => state.rides);

  return (
    <Layout>
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
    </Layout>
  );
};

export default UsersOwnActiveRides;
