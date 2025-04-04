import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTime, getDate } from 'utilities/helpers/date-time';
import { encryptData } from 'utilities/helpers/encription';
import { RIDE_DETAILS } from 'utilities/constants/routesConfig';
import { itemVariants } from 'utilities/constants/framerVariants';
import { MAX_PASSENGERS_LABEL, Ride } from 'types/ride';
import { FC } from 'react';
import { useAppSelector } from 'hooks/useAppSelector';
import { IconCar } from 'components/icons';

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
        className={`card card--light card--stats ${isUserSubscribedToRide ? 'card--ribbon-right' : ''}`}>
        <div className="card__header">
          <div className="card__icon">
						<IconCar />
					</div>
          <div className="ml-md">
            <h5 className="card__header-title">
              <span>{ride.route.origin?.address_components.city ?? 'N/A'}</span>
              <span>&nbsp;to&nbsp;</span>
              <span>
                {ride.route.destination?.address_components.city ?? 'N/A'}
              </span>
            </h5>
            <p className="card__header-description">
              <span>{`${getDate(ride.departureDate) ?? 'N/A'}`}</span>
              <span className="mh-sm">&nbsp;|&nbsp;</span>
              <span>{`${getTime(ride.departureDate) ?? 'N/A'}`}</span>
            </p>
          </div>
        </div>
        <div className="card__body">
          <div className="card__section--flex">
            <h4 className="card__price">{`$${ride.price}`}</h4>
            <p>
              {`${ride.passengers.length} of ${
                MAX_PASSENGERS_LABEL[ride.maxPassengers]
              }`}{' '}
              Passengers
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ActiveRideCard;
