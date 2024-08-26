import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTime, getDate } from 'utilities/helpers/date-time';
import { encryptData } from 'utilities/helpers/encription';
import { RIDE_DETAILS } from 'utilities/constants/routesConfig';
import { itemVariants } from 'utilities/constants/framerVariants';
import { MAX_PASSENGERS_LABEL, Ride } from 'types/ride';
import { FC } from 'react';
import { useAppSelector } from 'hooks/useAppSelector';

type ActiveRideCardOwnProps = {
  ride: Ride;
};

const ActiveRideCard: FC<ActiveRideCardOwnProps> = ({ ride }) => {
  const { userDetails } = useAppSelector(state => state.user);
  const isUserSubscribedToRide = userDetails?.activeRides.find(
    rideId => rideId === ride.rideId,
  );
  const encryptedRideId = encryptData(
    ride.rideId,
    process.env.REACT_APP_QUERY_PARAM_SECRET_KEY as string,
  );

  return (
    <motion.div variants={itemVariants}>
      <Link
        to={`${RIDE_DETAILS.path}?rideId=${encryptedRideId}`}
        className="card card--dark card--stats">
        <div
          className={`card__header card__decorated ${
            isUserSubscribedToRide ? 'card__decorated--active' : ''
          }`}>
          <p>{ride.route.origin?.address_components.city ?? 'N/A'}</p>
          <div className="card__decorated-dash" />
          <i className="icon-car-ride icon-md" />
          <div className="card__decorated-dash" />
          <p>{ride.route.destination?.address_components.city ?? 'N/A'}</p>
        </div>
        <div className="card__body">
          <div className="card__section card__radius--bottom">
            <dl className="list-desc__columns list-desc--sm">
              <div className="list-desc__col text-center">
                <dt>Passengers</dt>
                <dd>{`${ride.passengers.length} of ${
                  MAX_PASSENGERS_LABEL[ride.maxPassengers]
                }`}</dd>
              </div>
              <div className="list-desc__col text-center">
                <dt>Departure</dt>
                <dd>{`${getDate(ride.departureDate) ?? 'N/A'}`}</dd>
                <dd>{`${getTime(ride.departureDate) ?? 'N/A'}`}</dd>
              </div>
              <div className="list-desc__col text-center">
                <dt>Price</dt>
                <dd>{`$${ride.price}`}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ActiveRideCard;
