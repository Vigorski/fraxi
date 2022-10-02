import { Link } from 'react-router-dom';

import { getTime, getShortDate } from '../../../utilities/date-time';
import { IconUserPlaceholder } from '../../../components/icons';
import { RIDE_DETAILS } from '../../../utilities/constants/routes';

const RideResults = ({ filteredRides }) => {
	return (
		<div className='card__wrapper'>
			{filteredRides.map(ride => {
				const driverHasPicture = ride.driverDetails.profilePicture.length > 0;

				return (
					<Link to={{ pathname: `${RIDE_DETAILS.path}/${ride.rideId}`, state: { rideDetails: ride } }} className='card card__ride card--gray' key={ride.rideId}>
						<div className='card__body'>
							<div className='card__section card__ride-info card__radius--top pb-0'>
								<div className='row'>
									<div className='col-7'>
										<h6>{ride.driverDetails.name + ' ' + ride.driverDetails.surname}</h6>
										<p>{getShortDate(ride.departureDate) ?? 'N/A'}</p>
										<p>{getTime(ride.departureDate) ?? 'N/A'}</p>
									</div>
									<div className='col-5'>
										<div className='thumbnail__user'>
											{driverHasPicture ? <img src={ride.driverDetails.profilePicture} alt='driver thumbnail' /> : <IconUserPlaceholder />}
										</div>
									</div>
								</div>
							</div>
							<div className="card__stamp">
								<div className="card__stamp-border" />
							</div>
							<div className='card__section card__ride-price card__radius--bottom pt-0'>
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
					</Link>
				);
			})}
		</div>
	);
};

export default RideResults;
