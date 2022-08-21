import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import Layout from '../../../components/shared/Layout';
import { getTime, getShortDate } from '../../../utilities/date-time';
import { IconUserPlaceholder, IconMarker, IconPhone } from '../../../components/icons';
import { bookRide, removePassengerRide, addPassengersDetailsToActiveRides } from '../../../store/rides/ridesActions';
import { PASSENGER, DRIVER } from '../../../utilities/constants/users';

const RideDetails = () => {
	const history = useHistory();
	const location = useLocation();
	const userDetails = useSelector(state => state.user.userDetails);
	const dispatch = useDispatch();

	const { rideDetails } = location.state;
	const { driverDetails, ...ridePure } = rideDetails;
	const driverHasPicture = driverDetails.profilePicture.length > 0;
	const isRideBooked = userDetails.activeRides.indexOf(rideDetails.rideId) >= 0;
	const isUserPassenger = userDetails.userType === PASSENGER;
	const isUserDriver = userDetails.userType === DRIVER;
console.log(rideDetails)
	useEffect(() => {
		if(rideDetails?.passengers) {
			dispatch(addPassengersDetailsToActiveRides(rideDetails.passengers));
		}
	}, [dispatch, rideDetails.passengers]);

	const handleBookRide = async () => {
		const doesRideExist = userDetails.activeRides.indexOf(ridePure.rideId) >= 0;

		if (!doesRideExist) {
			await dispatch(bookRide(userDetails, ridePure));
		}
	};

	const handleCancelRide = async () => {
		await dispatch(removePassengerRide(rideDetails, userDetails, history));
	};

	return (
		<Layout>
			<section className='ride-details' data-username={`${driverDetails?.name} ${driverDetails?.surname}`}>
				<div className='ride-details__driver'>
					<div className='row'>
						<div className='col-6'>
							<div className='ride-details__photo thumbnail__user'>
								{driverHasPicture ? 
									<img src={driverDetails.profilePicture} alt='driver thumbnail' /> :
									<IconUserPlaceholder />
								}
							</div>
						</div>
						<div className='col-6'>
							<div className="ride-details__info">
								<p><IconMarker /> <span>{rideDetails.origin}</span></p>
								<p><IconPhone /> <span>{driverDetails.phone}</span></p>
								<h3>{`${driverDetails.name} ${driverDetails.surname}`}</h3>
							</div>
						</div>
					</div>
				</div>

				<div className='card card--dark card--stats' key={rideDetails.rideId}>
					<div className='card__header'>
						<div className={`card__section card__decorated ${isRideBooked ? 'card__decorated--active' : ''}`}>
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
						<div className={`card__section ${isUserDriver ? 'card__section--border-dashed' : ''}`}>
							<dl className='list-desc__rows'>
								{isUserPassenger && 
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
						{isUserDriver &&
							<div className='card__section'>
								<h4>{`Passengers: ${rideDetails.passengers.length} / ${rideDetails.maxPassengers}`}</h4>
								{/* <ul className='list'>
									{passengersDetails.map(passenger => 
										<li key={passenger.userId}>{`${passenger.name} ${passenger.surname}`}</li>
									)}
								</ul> */}
							</div>
						}
					</div>
				</div>

				{(isUserPassenger && !isRideBooked) &&
					<button className='btn-primary btn-block mt-xxl' disabled={isRideBooked} onClick={handleBookRide}>
						Book ride
					</button>
				}

				{isRideBooked && 
					<button className='btn-primary-ghost btn-block mt-xxl' onClick={handleCancelRide}>
						Cancel ride
					</button>
				}
			</section>
		</Layout>
	);
};

export default RideDetails;
