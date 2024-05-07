import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import RideDetailsCard from './RideDetailsCard';
import DriverRouteMap from 'components/map/DriverRouteMap';
import { removePassengerRide } from 'store/rides/ridesAsyncActions';
import { getUsersList } from 'utilities/shared/getUsersList';
import { USERS_OWN_ACTIVE_RIDES } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';

const RideDetailsDriver = ({ rideDetails }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userDetails = useSelector(state => state.user.userDetails);
  const [allPassengersDetails, setAllPassengersDetails] = useState(null);

  useEffect(() => {
    async function fetchPassengers() {
      const passengersFull = await getUsersList(rideDetails.passengers);
      setAllPassengersDetails(passengersFull);
    }
    if (rideDetails.passengers) {
      fetchPassengers();
    }
  }, [rideDetails.passengers]);

  const handleCancelRide = async () => {
    await dispatch(removePassengerRide({ rideDetails, userDetails })).unwrap();
    history.push(USERS_OWN_ACTIVE_RIDES.path);
  };

  return (
    <motion.section
      className="ride-details"
      variants={mainContainerVariants}
      initial="initial"
      animate="visible"
      exit="hidden"
      data-bg-text={`${userDetails?.name} ${userDetails?.surname}`}>
      <motion.div className="form-field" variants={itemVariants}>
        <DriverRouteMap
          originCity={rideDetails.route.origin}
          destinationCity={rideDetails.route.destination}
          waypoints={rideDetails.route.waypoints}
        />
      </motion.div>

      <RideDetailsCard
        rideDetails={rideDetails}
        allPassengersDetails={allPassengersDetails}
      />

      <motion.button
        className="btn-primary-ghost btn-block mt-xxl"
        onClick={handleCancelRide}
        variants={itemVariants}>
        Cancel ride
      </motion.button>
    </motion.section>
  );
};

export default RideDetailsDriver;
