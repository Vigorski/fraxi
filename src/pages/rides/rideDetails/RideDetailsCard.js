import { motion } from 'framer-motion';

import { DRIVER, PASSENGER } from '../../../utilities/constants/users';
import { getTime, getShortDate } from '../../../utilities/date-time';
import { IconUser } from '../../../components/icons';
import { itemVariants } from '../../../utilities/constants/framerVariants';

const CardRideDetails = ({rideDetails, userType, driverDetails, isRideBooked, allPassengersDetails}) => {
  const isPassenger = userType === PASSENGER;
  const isDriver = userType === DRIVER;

  return (
    <motion.div className='card card--dark' variants={itemVariants}>
      <div className={`card__header card__decorated card__radius--top--sm ${isRideBooked || isDriver ? 'card__decorated--active' : ''}`}>
        <p>{rideDetails.originAbbr ?? 'N/A'}</p>
        <div className='card__decorated-dash' />
        <i className='icon-car-ride icon-md' />
        <div className='card__decorated-dash' />
        <p>{rideDetails.destinationAbbr ?? 'N/A'}</p>
      </div>
      <div className='card__body'>
        <div className='card__section pb-0'>
          <dl className='list-desc__columns'>
            <div className='list-desc__col text-center'>
              <dt>Date</dt>
              <dd>{`${getShortDate(rideDetails.departureDate) ?? 'N/A'}`}</dd>
            </div>
            <div className='list-desc__col text-center'>
              <dt>Departure</dt>
              <dd>{`${getTime(rideDetails.departureDate) ?? 'N/A'}`}</dd>
            </div>
            <div className='list-desc__col text-center'>
              <dt>Price</dt>
              <dd>{`$${rideDetails.price}`}</dd>
            </div>
          </dl>
        </div>
        <div className="card__stamp">
          <div className="card__stamp-border" />
        </div>
        <div className={`card__section ${isPassenger ? 'card__radius--bottom pt-0' : 'pv-0'}`}>
          <dl className='list-desc__rows'>
            {isPassenger &&
              <>
                <div className='list-desc__row'>
                  <dt>Passengers</dt>
                  <dd className='text-center'>{`${rideDetails.passengers.length} / ${rideDetails.maxPassengers}`}</dd>
                </div>
                <div className='list-desc__row'>
                  <dt>Driver</dt>
                  <dd className='text-center'>{driverDetails.name}</dd>
                </div>
              </>
            }
            <div className='list-desc__row'>
              <dt>Route</dt>
              <dd className='text-center'>{rideDetails.rideType}</dd>
            </div>
            <div className='list-desc__row'>
              <dt>Smoking</dt>
              <dd className='text-center'>{`${rideDetails.smoking ? 'Yes' : 'No'}`}</dd>
            </div>
            <div className='list-desc__row'>
              <dt># of stops</dt>
              <dd className='text-center'>{rideDetails.passengers.length}</dd>
            </div>
          </dl>
        </div>
        {isDriver &&
          <>
            <div className="card__stamp">
              <div className="card__stamp-border" />
            </div>
            <div className='card__section card__radius--bottom pt-0'>
              <h5 className="pv-sm">{`Passengers: ${rideDetails.passengers.length} / ${rideDetails.maxPassengers}`}</h5>
              <ul className='list list__users'>
                {!!allPassengersDetails && allPassengersDetails.map(passenger => 
                  <li key={passenger.userId}>
                    <IconUser />
                    {`${passenger.name} ${passenger.surname}`}
                  </li>
                )}
              </ul>
            </div>
          </>
        }
      </div>
    </motion.div>
  );
}

export default CardRideDetails;