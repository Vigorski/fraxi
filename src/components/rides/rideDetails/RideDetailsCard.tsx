import { FC } from 'react';
import { motion } from 'framer-motion';
import { IconUser } from 'components/icons';
import { useAppSelector } from 'hooks/useAppSelector';
import { getTime, getShortDate } from 'utilities/helpers/date-time';
import { itemVariants } from 'utilities/constants/framerVariants';
import { USER_TYPES } from 'types/auth';
import { User } from 'types/user';
import {
  MAX_PASSENGERS_LABEL,
  Ride,
  RIDE_TYPE_LABEL,
  SMOKING_LABEL,
} from 'types/ride';

type CardRideDetailsOwnProps = {
  rideDetails: Ride;
  driverDetails?: User;
  isRideBooked?: boolean;
  allPassengersDetails?: User[];
};

const CardRideDetails: FC<CardRideDetailsOwnProps> = ({
  rideDetails,
  driverDetails,
  isRideBooked,
  allPassengersDetails,
}) => {
  const userType = useAppSelector(state => state.user.userDetails?.userType);
  const isPassenger = userType === USER_TYPES.passenger;
  const isDriver = userType === USER_TYPES.driver;

  return (
    <motion.div className="card card--dark" variants={itemVariants}>
      <div
        className={`card__header card__decorated card__radius--top--sm ${
          isRideBooked || isDriver ? 'card__decorated--active' : ''
        }`}>
        <p>{rideDetails.route.origin.address_components.city ?? 'N/A'}</p>
        <div className="card__decorated-dash" />
        <i className="icon-car-ride icon-md" />
        <div className="card__decorated-dash" />
        <p>{rideDetails.route.destination.address_components.city ?? 'N/A'}</p>
      </div>
      <div className="card__body">
        <div className="card__section pb-0">
          <dl className="list-desc__columns">
            <div className="list-desc__col text-center">
              <dt>Date</dt>
              <dd>{`${getShortDate(rideDetails.departureDate) ?? 'N/A'}`}</dd>
            </div>
            <div className="list-desc__col text-center">
              <dt>Departure</dt>
              <dd>{`${getTime(rideDetails.departureDate) ?? 'N/A'}`}</dd>
            </div>
            <div className="list-desc__col text-center">
              <dt>Price</dt>
              <dd>{`$${rideDetails.price}`}</dd>
            </div>
          </dl>
        </div>
        <div className="card__stamp">
          <div className="card__stamp-border" />
        </div>
        <div
          className={`card__section ${
            isPassenger ? 'card__radius--bottom pt-0' : 'pv-0'
          }`}>
          <dl className="list-desc__rows">
            {isPassenger && (
              <>
                <div className="list-desc__row">
                  <dt>Passengers</dt>
                  <dd className="text-center">{`${
                    rideDetails.passengers.length
                  } / ${MAX_PASSENGERS_LABEL[rideDetails.maxPassengers]}`}</dd>
                </div>
                <div className="list-desc__row">
                  <dt>Driver</dt>
                  <dd className="text-center">{driverDetails?.name}</dd>
                </div>
              </>
            )}
            <div className="list-desc__row">
              <dt>Type of ride</dt>
              <dd className="text-center">
                {RIDE_TYPE_LABEL[rideDetails.rideType]}
              </dd>
            </div>
            <div className="list-desc__row">
              <dt>Smoking</dt>
              <dd className="text-center">
                {SMOKING_LABEL[rideDetails.smoking]}
              </dd>
            </div>
            <div className="list-desc__row">
              <dt>Total passengers</dt>
              <dd className="text-center">{rideDetails.passengers.length}</dd>
            </div>
          </dl>
        </div>
        {isDriver && (
          <>
            <div className="card__stamp">
              <div className="card__stamp-border" />
            </div>
            <div className="card__section card__radius--bottom pt-0">
              <h5 className="pv-sm">{`Passengers: ${
                rideDetails.passengers.length
              } / ${MAX_PASSENGERS_LABEL[rideDetails.maxPassengers]}`}</h5>
              <ul className="list list__users">
                {allPassengersDetails &&
                  allPassengersDetails.map(passenger => (
                    <li key={passenger.userId}>
                      <IconUser />
                      {`${passenger.name} ${passenger.surname}`}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CardRideDetails;
