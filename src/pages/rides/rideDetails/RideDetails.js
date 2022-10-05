import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Layout from '../../../components/shared/Layout';
import { PASSENGER, DRIVER } from '../../../utilities/constants/users';
import RideDetailsPassenger from './RideDetailsPassenger';
import RideDetailsDriver from './RideDetailsDriver';

const RideDetails = () => {
	// TODO: use the rideId from params to pull ride data from DB
	// ride passengers has same number after booking
	// const params = useParams();
	const location = useLocation();
	const userDetails = useSelector(state => state.user.userDetails);
	
	// const rideDetails = activeRides.find(ride => ride.rideId === params.rideId);
	const rideDetails = location.state.rideDetails;
	const isUserPassenger = userDetails.userType === PASSENGER;
	const isUserDriver = userDetails.userType === DRIVER;
	
	return (
		<Layout>
			{isUserPassenger && <RideDetailsPassenger userDetails={userDetails} rideDetails={rideDetails} />}
			{isUserDriver && <RideDetailsDriver userDetails={userDetails} rideDetails={rideDetails} />}
		</Layout>
	);
};

export default RideDetails;
