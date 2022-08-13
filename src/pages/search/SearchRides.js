import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Layout from '../../components/shared/Layout';
import { getFilteredRides } from '../../store/rides/ridesActions';
import { getTime, getShortDate } from '../../utilities/date-time';
import { IconUserPlaceholder } from '../../components/icons';

const SearchRides = () => {
	const dispatch = useDispatch();
	const { userDetails } = useSelector(state => state.user);
	const { filteredRides } = useSelector(state => state.rides);
	const ridePreferences = userDetails?.ridePreferences;

	useEffect(() => {
		if (userDetails) {
			dispatch(getFilteredRides(ridePreferences));
		}
	}, [dispatch, userDetails, ridePreferences]);

	return (
		<Layout>
			<section className='search-rides'>
				<div className='card__wrapper'>
					{filteredRides.length > 0 &&
						filteredRides.map(ride => {
							const hasDriverPicture = ride.driverDetails.profilePicture.length > 0;
							// console.log(ride)
							return (
								<div className='card card__ride card--gray' key={ride.rideId}>
									<div className='card__body'>
										<div className='card__section card__ride-info card__section--clip card__section--border-dashed'>
											<div className='row'>
												<div className='col-7'>
													<h6>{ride.driverDetails.name + ' ' + ride.driverDetails.surname}</h6>
													<p>{getShortDate(ride.departureDate) ?? 'N/A'}</p>
													<p>{getTime(ride.departureDate) ?? 'N/A'}</p>
												</div>
												<div className='col-5'>
													<div className='card__ride-thumbnail'>
														{hasDriverPicture ? 
                              <img src={ride.driverDetails.profilePicture} alt='driver thumbnail' /> : 
                              <IconUserPlaceholder />
                            }
													</div>
												</div>
											</div>
										</div>
										<div className='card__section card__ride-price'>
											<div className='row'>
												<div className='col-7'>
													<h6>Price</h6>
												</div>
												<div className='col-5'>
													<h6>${ride.price}</h6>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</section>
		</Layout>
	);
};

export default SearchRides;
