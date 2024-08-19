import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DriverRouteMap from 'components/map/DriverRouteMap';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { removePassengerFromRide } from 'store/rides/ridesAsyncActions';
import { getUsersList } from 'utilities/shared/getUsersList';
import { USERS_OWN_ACTIVE_RIDES } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import { Ride } from 'types/ride';
import { User } from 'types/user';
import RideDetailsCard from './RideDetailsCard';

type RideDetailsDriverOwnProps = {
  rideDetails: Ride;
};

const RideDetailsDriver: FC<RideDetailsDriverOwnProps> = ({ rideDetails }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userDetails = useAppSelector(state => state.user.userDetails);
  const [allPassengersDetails, setAllPassengersDetails] = useState<User[]>();

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
    if (userDetails) {
      await dispatch(
        removePassengerFromRide({ ride: rideDetails, passenger: userDetails }),
      ).unwrap();
      navigate(USERS_OWN_ACTIVE_RIDES.path);
    }
  };

  return (
    <motion.section
      className="ride-details"
      variants={mainContainerVariants}
      initial="initial"
      animate="visible"
      exit="hidden"
      data-bg-text={`${userDetails?.name} ${userDetails?.surname}`}>
      <RideDetailsCard
        rideDetails={rideDetails}
        allPassengersDetails={allPassengersDetails}
      />

      <motion.div className="mt-xxl" variants={itemVariants}>
        <DriverRouteMap
          originCity={rideDetails.route.origin}
          destinationCity={rideDetails.route.destination}
          waypoints={rideDetails.route.waypoints}
          storeRouteMapDetails={undefined} // #TODO: remove this once DriverRouteMap has been typed
        />
      </motion.div>

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
