import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IconMarker,
  IconPhone,
  IconHeartOutline,
  IconHeart,
} from 'components/icons';
import PassengerRouteMap from 'components/map/PassengerRouteMap';
import UserPicture from 'components/shared/UserPicture';
import { removePassengerFromRide } from 'store/rides/ridesAsyncActions';
import { bookRide } from 'store/rides/ridesAsyncActions';
import { saveDriver, unsaveDriver } from 'store/user/userAsyncActions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { USERS_OWN_ACTIVE_RIDES } from 'utilities/constants/routesConfig';
import {
  itemVariants,
} from 'utilities/constants/framerVariants';
import { RideWithDriver } from 'types/ride';
import { Route, Waypoint } from 'types/map';
import RideDetailsCard from './RideDetailsCard';
import MotionWrapper from 'components/shared/MotionWrapper';

type RideDetailsPassengerOwnProps = {
  rideDetails: RideWithDriver;
  bookRideCallback: () => void;
};

const RideDetailsPassenger: FC<RideDetailsPassengerOwnProps> = ({
  rideDetails,
  bookRideCallback,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userDetails = useAppSelector(state => state.user.userDetails);
  const [routeMapDetails, setRouteMapDetails] = useState<Route>(
    rideDetails.route,
  );
  const driverDetails = rideDetails.driverDetails;
  const userExistsInRide =
    userDetails?.activeRides.indexOf(rideDetails?.rideId) ?? -1;
  const isRideBooked = userExistsInRide >= 0;
  const isWaypointPicked = !!routeMapDetails.waypoints?.find(
    (waypoint: Waypoint) => waypoint.userId === userDetails?.userId,
  );
  const isDriverSaved = !!userDetails?.savedDrivers.find(
    driver => driver === rideDetails.driverId,
  );

  const handleBookRide = async () => {
    if (userDetails && !isRideBooked && isWaypointPicked) {
      await dispatch(
        bookRide({
          passenger: userDetails,
          ride: rideDetails,
          waypoints: routeMapDetails.waypoints,
        }),
      ).unwrap();

      bookRideCallback();
    }
  };

  const handleCancelRide = async () => {
    if (userDetails) {
      const waypoints = routeMapDetails.waypoints?.filter(
        waypoint => waypoint.userId !== userDetails?.userId,
      );
      await dispatch(
        removePassengerFromRide({
          ride: rideDetails,
          passenger: userDetails,
          waypoints,
        }),
      ).unwrap();
      navigate(USERS_OWN_ACTIVE_RIDES.path);
    }
  };

  const handleSaveDriver = () => {
    if (userDetails) {
      dispatch(saveDriver({ userDetails, driverId: rideDetails.driverId }));
    }
  };

  const handleUnsaveDriver = () => {
    if (userDetails) {
      dispatch(unsaveDriver({ userDetails, driverId: rideDetails.driverId }));
    }
  };

  return (
    <MotionWrapper className="ride-details">
      <>
        <div className="ride-details__driver">
          <div className="row">
            <div className="col-6">
              <motion.div
                className="ride-details__photo thumbnail__user"
                variants={itemVariants}>
                <UserPicture profilePicture={driverDetails.profilePicture} />
              </motion.div>
            </div>
            <div className="col-6">
              <div className="ride-details__info">
                <motion.p variants={itemVariants}>
                  <IconMarker />{' '}
                  <span>
                    {rideDetails.route.origin?.address_components.city}
                  </span>
                </motion.p>
								{driverDetails.phone && 
									<motion.p variants={itemVariants}>
										<IconPhone /> <span>{driverDetails.phone}</span>
									</motion.p>
								}
                <motion.h5 variants={itemVariants}>{`${driverDetails.name} ${driverDetails.surname}`}</motion.h5>
              </div>
              <motion.div
                className="ride-details__save-driver"
                variants={itemVariants}>
                {isDriverSaved ? (
                  <button
                    className="btn-stripped ride-details__btn-save"
                    onClick={handleUnsaveDriver}>
                    <IconHeart className="ride-details__save-icon ride-details__save-icon--active" />
                  </button>
                ) : (
                  <button className="btn-stripped" onClick={handleSaveDriver}>
                    <IconHeartOutline className="ride-details__save-icon" />
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <RideDetailsCard
          rideDetails={rideDetails}
          isRideBooked={isRideBooked}
        />

        <motion.div className="mt-xxl" variants={itemVariants}>
          <PassengerRouteMap
            originCity={rideDetails.route.origin}
            destinationCity={rideDetails.route.destination}
            waypoints={rideDetails.route.waypoints}
            storeRouteMapDetails={setRouteMapDetails}
          />
        </motion.div>

        {isRideBooked ? (
          <motion.button
            className="btn-primary-ghost btn-block mt-xxl"
            onClick={handleCancelRide}
            variants={itemVariants}>
            Cancel ride
          </motion.button>
        ) : (
          <motion.button
            className="btn-primary btn-block mt-xxl"
            onClick={handleBookRide}
            variants={itemVariants}
            disabled={!isWaypointPicked}>
            Book ride
          </motion.button>
        )}
      </>
    </MotionWrapper>
  );
};

export default RideDetailsPassenger;
