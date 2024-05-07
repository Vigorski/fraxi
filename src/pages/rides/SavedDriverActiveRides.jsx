import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import ActiveRides from 'components/rides/activeRides/ActiveRides';
import { getRidesState } from 'store/rides/ridesAsyncActions';
import {
  itemVariants,
  mainContainerVariants,
} from 'utilities/constants/framerVariants';

const SavedDriverActiveRides = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const activeRidesIds = location.state.activeRides;
  const [activeRides, setActiveRides] = useState();
  let driverNames = '';
  if (activeRides) {
    driverNames = `${activeRides[0].driverDetails.name} ${activeRides[0].driverDetails.surname}`;
  }

  useEffect(() => {
    const fetchRides = async () => {
      const ridesResponse = await dispatch(
        getRidesState({ rideIds: activeRidesIds }),
      ).unwrap();

      setActiveRides(ridesResponse.ridesAndDrivers);
    };

    fetchRides();
  }, [activeRidesIds, dispatch]);

  return (
    <Layout>
      <motion.section
        className="active-rides"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.div variants={itemVariants} className="mb-xl">
          <p className="text-xs text-primary">Driver</p>
          <h4>{driverNames}</h4>
        </motion.div>
        <motion.p variants={itemVariants} className="text-xs text-primary">
          Active rides
        </motion.p>
        <div className="card__wrapper">
          <ActiveRides activeRides={activeRides} />
        </div>
      </motion.section>
    </Layout>
  );
};

export default SavedDriverActiveRides;
