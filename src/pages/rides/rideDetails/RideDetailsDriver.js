import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { removePassengerRide } from '../../../store/rides/ridesAsyncActions';
import { getUsers } from '../../../utilities/api/api';
import { getTime, getShortDate } from '../../../utilities/date-time';
import { ACTIVE_RIDES } from '../../../utilities/constants/routes';

const RideDetailsDriver = ({userDetails, rideDetails}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allPassengersDetails, setAllPassengersDetails] = useState(null);

  useEffect(() => {
		async function fetchPassengers () {
			const passengersFull = await getUsers(rideDetails.passengers);
			setAllPassengersDetails(passengersFull)
		}
		if(rideDetails.passengers) {
			fetchPassengers();
		}
	}, [rideDetails.passengers]);

  const handleCancelRide = async () => {
		await dispatch(removePassengerRide({ rideDetails, userDetails })).unwrap();
    history.push(ACTIVE_RIDES.path);
	};

  return (
    <section className='ride-details'>
      <div className='card card--dark card--stats' key={rideDetails.rideId}>
        <div className='card__header'>
          <div className='card__section card__decorated card__decorated--active'>
            <p>{rideDetails.originAbbr ?? 'N/A'}</p>
            <div className='card__decorated-dash' />
            <i className='icon-car-ride icon-md' />
            <div className='card__decorated-dash' />
            <p>{rideDetails.destinationAbbr ?? 'N/A'}</p>
          </div>
        </div>
        <div className='card__body'>
          <div className='card__section card__section--border-dashed'>
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
          <div className='card__section card__section--border-dashed'>
            <dl className='list-desc__rows'>
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
          <div className='card__section'>
            <h4>{`Passengers: ${rideDetails.passengers.length} / ${rideDetails.maxPassengers}`}</h4>
            <ul className='list'>
              {!!allPassengersDetails && allPassengersDetails.map(passenger => 
                <li key={passenger.userId}>{`${passenger.name} ${passenger.surname}`}</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <button className='btn-primary-ghost btn-block mt-xxl' onClick={handleCancelRide}>
        Cancel ride
      </button>
    </section>
  );
}

export default RideDetailsDriver;