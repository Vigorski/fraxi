import { Link } from 'react-router-dom';

import { RIDE_DETAILS } from '../../../utilities/constants/routes';
import { getTime, getShortDate } from '../../../utilities/date-time';

const ActiveRidesCard = ({ activeRides }) =>
	activeRides.map(ride => {
		return (
      <Link to={{ pathname: RIDE_DETAILS.path, state: { rideDetails: ride } }} className='card card--dark card--stats' key={ride.rideId}>
        <div className='card__header'>
          <div className='card__section card__section--border-dashed card__decorated card__decorated--active'>
            <p>{ride.originAbbr ?? 'N/A'}</p>
            <div className='card__decorated-dash' />
            <i className='icon-car-ride icon-md' />
            <div className='card__decorated-dash' />
            <p>{ride.destinationAbbr ?? 'N/A'}</p>
          </div>
        </div>
        <div className='card__body'>
          <div className='card__section card__section--border-dashed'>
            <dl className='list-desc__columns'>
              <div className='list-desc__col text-center'>
                <dt>Date</dt>
                <dd>{`${getShortDate(ride.departureDate) ?? 'N/A'}`}</dd>
              </div>
              <div className='list-desc__col text-center'>
                <dt>Departure</dt>
                <dd>{`${getTime(ride.departureDate) ?? 'N/A'}`}</dd>
              </div>
              <div className='list-desc__col text-center'>
                <dt>Price</dt>
                <dd>{`$${ride.price}`}</dd>
              </div>
            </dl>
          </div>
          <div className='card__section'>
            <dl className='list-desc__rows'>
              <div className='list-desc__row'>
                <dt>Passengers</dt>
                <dd className='text-center'>{`${ride.passengers.length} / ${ride.maxPassengers}`}</dd>
              </div>
              <div className='list-desc__row'>
                <dt>Driver</dt>
                <dd className='text-center'>{ride.driverDetails?.name}</dd>
              </div>
              <div className='list-desc__row'>
                <dt>Route</dt>
                <dd className='text-center'>{ride.rideType}</dd>
              </div>
              <div className='list-desc__row'>
                <dt>Smoking</dt>
                <dd className='text-center'>{`${ride.smoking ? 'Yes' : 'No'}`}</dd>
              </div>
              <div className='list-desc__row'>
                <dt># of stops</dt>
                <dd className='text-center'>{ride.passengers.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Link>
		);
	});

export default ActiveRidesCard;
