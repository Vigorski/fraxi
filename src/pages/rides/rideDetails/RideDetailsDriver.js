import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { removePassengerRide } from '../../../store/rides/ridesAsyncActions';
import { getUsers } from '../../../utilities/api/api';
import CardRideDetails from '../../../components/cards/CardRideDetails';
import { ACTIVE_RIDES } from '../../../utilities/constants/routes';

const RideDetailsDriver = ({userDetails, rideDetails}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allPassengersDetails, setAllPassengersDetails] = useState(null);

  useEffect(() => {
		async function fetchPassengers () {
      // TODO: fix the getUser function (already have a FB api file)
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
      
      <CardRideDetails userType={userDetails.userType} rideDetails={rideDetails} allPassengersDetails={allPassengersDetails} />

      <button className='btn-primary-ghost btn-block mt-xxl' onClick={handleCancelRide}>
        Cancel ride
      </button>
    </section>
  );
}

export default RideDetailsDriver;