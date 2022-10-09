import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

import RideDetailsCard from './RideDetailsCard';
import { removePassengerRide } from '../../../store/rides/ridesAsyncActions';
import { bookRide } from '../../../store/rides/ridesAsyncActions';
import { IconUserPlaceholder, IconMarker, IconPhone } from '../../../components/icons';
import { ACTIVE_RIDES } from '../../../utilities/constants/routes';
import { mainContainerVariants, itemVariants } from '../../../utilities/constants/framerVariants';

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
		<motion.section
			className='ride-details'
			variants={mainContainerVariants}
			initial="initial"
			animate="visible"
			exit="hidden"
		>
			<div className='ride-details__driver'>
				<div className='row'>
					<div className='col-6'>
						<motion.div className='ride-details__photo thumbnail__user' variants={itemVariants}>
							{driverHasPicture ? <img src={driverDetails.profilePicture} alt='driver thumbnail' /> : <IconUserPlaceholder />}
						</motion.div>
					</div>
					<div className='col-6'>
						<div className='ride-details__info'>
							<motion.p variants={itemVariants}>
								<IconMarker /> <span>{rideDetails.origin}</span>
							</motion.p>
							<motion.p variants={itemVariants}>
								<IconPhone /> <span>{driverDetails.phone}</span>
							</motion.p>
							<h3>{`${driverDetails.name} ${driverDetails.surname}`}</h3>
						</div>
					</div>
				</div>
			</div>

			<RideDetailsCard userType={userDetails.userType} rideDetails={rideDetails} driverDetails={driverDetails} isRideBooked={isRideBooked} />

			{!isRideBooked && (
				<motion.button className='btn-primary btn-block mt-xxl' disabled={isRideBooked} onClick={handleBookRide} variants={itemVariants}>
					Book ride
				</motion.button>
			)}

			{isRideBooked && (
				<motion.button className='btn-primary-ghost btn-block mt-xxl' onClick={handleCancelRide} variants={itemVariants}>
					Cancel ride
				</motion.button>
			)}
		</motion.section>
	);
};

export default RideDetailsPassenger;
