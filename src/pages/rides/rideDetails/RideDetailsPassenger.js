import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import CardRideDetails from '../../../components/cards/CardRideDetails';
import { removePassengerRide } from '../../../store/rides/ridesAsyncActions';
import { bookRide } from '../../../store/rides/ridesAsyncActions';
import { IconUserPlaceholder, IconMarker, IconPhone } from '../../../components/icons';
import { ACTIVE_RIDES } from '../../../utilities/constants/routes';

const RideDetailsPassenger = ({ userDetails, rideDetails }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const driverDetails = rideDetails?.driverDetails;
	const driverHasPicture = driverDetails?.profilePicture !== '';
	const isRideBooked = userDetails.activeRides.indexOf(rideDetails?.rideId) >= 0;

	const handleBookRide = async () => {
		const rideExists = userDetails.activeRides.indexOf(rideDetails?.rideId) >= 0;

		if (!rideExists) {
			await dispatch(bookRide({ passenger: userDetails, rideDetails })).unwrap();
		}
	};

	const handleCancelRide = async () => {
		await dispatch(removePassengerRide({ rideDetails, userDetails })).unwrap();
		history.push(ACTIVE_RIDES.path);
	};

	return (
		<section className='ride-details'>
			<div className='ride-details__driver'>
				<div className='row'>
					<div className='col-6'>
						<div className='ride-details__photo thumbnail__user'>
							{driverHasPicture ? <img src={driverDetails.profilePicture} alt='driver thumbnail' /> : <IconUserPlaceholder />}
						</div>
					</div>
					<div className='col-6'>
						<div className='ride-details__info'>
							<p>
								<IconMarker /> <span>{rideDetails.origin}</span>
							</p>
							<p>
								<IconPhone /> <span>{driverDetails.phone}</span>
							</p>
							<h3>{`${driverDetails.name} ${driverDetails.surname}`}</h3>
						</div>
					</div>
				</div>
			</div>

			<CardRideDetails userType={userDetails.userType} rideDetails={rideDetails} driverDetails={driverDetails} isRideBooked={isRideBooked} />

			{!isRideBooked && (
				<button className='btn-primary btn-block mt-xxl' disabled={isRideBooked} onClick={handleBookRide}>
					Book ride
				</button>
			)}

			{isRideBooked && (
				<button className='btn-primary-ghost btn-block mt-xxl' onClick={handleCancelRide}>
					Cancel ride
				</button>
			)}
		</section>
	);
};

export default RideDetailsPassenger;
