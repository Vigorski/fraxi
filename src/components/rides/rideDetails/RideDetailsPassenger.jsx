import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import RideDetailsCard from './RideDetailsCard';
import { removePassengerRide } from 'store/rides/ridesAsyncActions';
import { bookRide } from 'store/rides/ridesAsyncActions';
import { saveDriver, unsaveDriver } from 'store/user/userAsyncActions';
import {
  IconMarker,
  IconPhone,
  IconHeartOutline,
  IconHeart,
} from 'components/icons';
import PassengerRouteMap from 'components/map/PassengerRouteMap';
import UserPicture from 'components/shared/UserPicture';
import { USERS_OWN_ACTIVE_RIDES } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';

const RideDetailsPassenger = ({ rideDetails }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userDetails = useSelector(state => state.user.userDetails);
  const [routeMapDetails, setRouteMapDetails] = useState(rideDetails.route);
  const driverDetails = rideDetails?.driverDetails;
  const isRideBooked =
    userDetails.activeRides.indexOf(rideDetails?.rideId) >= 0;
  const isWaypointPicked = routeMapDetails.waypoints.find(
    waypoint => waypoint.userId === userDetails.userId,
  );
  const isDriverSaved = userDetails.savedDrivers.find(
    driver => driver === rideDetails.driverId,
  );

  const handleBookRide = () => {
    if (!isRideBooked && isWaypointPicked) {
      dispatch(
        bookRide({
          passenger: userDetails,
          rideDetails,
          waypoints: routeMapDetails.waypoints,
        }),
      );
    }
  };

  const handleCancelRide = async () => {
    const waypoints = routeMapDetails.waypoints.filter(
      waypoint => waypoint.userId !== userDetails.userId,
    );
    await dispatch(
      removePassengerRide({ rideDetails, userDetails, waypoints }),
    ).unwrap();
    history.push(USERS_OWN_ACTIVE_RIDES.path);
  };

  const handleSaveDriver = () => {
    dispatch(saveDriver({ userDetails, driverId: rideDetails.driverId }));
  };

  const handleUnsaveDriver = () => {
    dispatch(unsaveDriver({ userDetails, driverId: rideDetails.driverId }));
  };

  return (
    <motion.section
      className="ride-details"
      variants={mainContainerVariants}
      initial="initial"
      animate="visible"
      exit="hidden"
      data-bg-text={`${userDetails?.name} ${userDetails?.surname}`}>
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
                <span>{rideDetails.route.origin.address_components.city}</span>
              </motion.p>
              <motion.p variants={itemVariants}>
                <IconPhone /> <span>{driverDetails.phone}</span>
              </motion.p>
              <h3>{`${driverDetails.name} ${driverDetails.surname}`}</h3>
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

      <motion.div className="form-field" variants={itemVariants}>
        <PassengerRouteMap
          originCity={rideDetails.route.origin}
          destinationCity={rideDetails.route.destination}
          waypoints={rideDetails.route.waypoints}
          storeRouteMapDetails={setRouteMapDetails}
        />
      </motion.div>

      <RideDetailsCard
        userType={userDetails.userType}
        rideDetails={rideDetails}
        driverDetails={driverDetails}
        isRideBooked={isRideBooked}
      />

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
    </motion.section>
  );
};

export default RideDetailsPassenger;
