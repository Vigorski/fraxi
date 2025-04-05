import { FC } from 'react';
import { motion } from 'framer-motion';
import { IconCar } from 'components/icons';
import { useAppSelector } from 'hooks/useAppSelector';
import { getTime, getShortDate } from 'utilities/helpers/date-time';
import { itemVariants } from 'utilities/constants/framerVariants';
import { USER_TYPES } from 'types/auth';
import { User } from 'types/user';
import {
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE_LABEL,
  RideWithDriver,
  SMOKING_LABEL,
} from 'types/ride';

type CardRideDetailsOwnProps = {
  rideDetails: RideWithDriver;
  isRideBooked?: boolean;
  allPassengersDetails?: User[];
};

const CardRideDetails: FC<CardRideDetailsOwnProps> = ({
  rideDetails,
  isRideBooked,
  allPassengersDetails,
}) => {
  const userType = useAppSelector(state => state.user.userDetails?.userType);
  const isPassenger = userType === USER_TYPES.passenger;
  const isDriver = userType === USER_TYPES.driver;

  return (
    <motion.div className={`card card__ride-description card--light ${isRideBooked || isDriver ? 'card--ribbon-top' : ''}`} variants={itemVariants}>
      <div
        className="card__header">
				<h5>{rideDetails.route.origin?.address_components.city ?? 'N/A'}</h5>
        <div className="icon__stamp">
					<IconCar />
				</div>
				<h5>{rideDetails.route.destination?.address_components.city ?? 'N/A'}</h5>
      </div>
      <div className="card__body">
        <div className="card__section mt-sm">
          <dl className="list-desc__columns">
						<div className="list-desc__col text-center">
              <dt>Price</dt>
              <dd>{`$${rideDetails.price}`}</dd>
            </div>
						<div className="list-desc__col text-center">
              <dt>Date</dt>
              <dd>{`${getShortDate(rideDetails.departureDate) ?? 'N/A'}`}</dd>
            </div>
            <div className="list-desc__col text-center">
              <dt>Departure</dt>
              <dd>{`${getTime(rideDetails.departureDate) ?? 'N/A'}`}</dd>
            </div>
          </dl>
        </div>
        <div
          className="card__section mt-md">
          <dl className="list-desc__rows">
            {isPassenger && (
              <>
                <div className="list-desc__row">
                  <dt>Driver</dt>
                  <dd className="text-right">{rideDetails.driverDetails.name + ' ' + rideDetails.driverDetails.surname}</dd>
                </div>
              </>
            )}
            <div className="list-desc__row">
              <dt>Type of ride</dt>
              <dd className="text-right">
                {RIDE_TYPE_LABEL[rideDetails.rideType]}
              </dd>
            </div>
            <div className="list-desc__row">
              <dt>Smoking</dt>
              <dd className="text-right">
                {SMOKING_LABEL[rideDetails.smoking]}
              </dd>
            </div>
            <div className="list-desc__row">
              <dt>Total passengers</dt>
              <dd className="text-right">{`${
                rideDetails.passengers.length
              } out of ${MAX_PASSENGERS_LABEL[rideDetails.maxPassengers]}`}</dd>
            </div>
          </dl>
        </div>
      </div>
    </motion.div>
  );
};

export default CardRideDetails;
