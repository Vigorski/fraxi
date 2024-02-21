import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Layout from 'layout/Layout';
import { PASSENGER, DRIVER } from 'utilities/constants/users';
import RideDetailsPassenger from '../../components/rides/rideDetails/RideDetailsPassenger';
import RideDetailsDriver from '../../components/rides/rideDetails/RideDetailsDriver';

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
			{isUserPassenger && <RideDetailsPassenger rideDetails={rideDetails} />}
			{isUserDriver && <RideDetailsDriver rideDetails={rideDetails} />}
		</Layout>
	);
};

export default RideDetails;
