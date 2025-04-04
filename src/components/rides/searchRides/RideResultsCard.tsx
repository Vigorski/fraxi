import { FC } from 'react';
import { Link } from 'react-router-dom';
import UserPicture from 'components/shared/UserPicture';
import { getTime, getShortDate } from 'utilities/helpers/date-time';
import { RIDE_DETAILS } from 'utilities/constants/routesConfig';
import { encryptData } from 'utilities/helpers/encription';
import { RideWithDriver } from 'types/ride';

type RideResultsCardOwnProps = {
  ride: RideWithDriver;
};

const RideResultsCard: FC<RideResultsCardOwnProps> = ({ ride }) => {
  const encryptedRideId = encryptData(
    ride.rideId,
    process.env.REACT_APP_QUERY_PARAM_SECRET_KEY as string,
  );

  return (
    <Link
      to={`${RIDE_DETAILS.path}?rideId=${encryptedRideId}`}
      className="card card__ride card--light">
      <div className="card__body mt-0">
				<div className="row">
					<div className="col-7">
						<p className="card__ride-title mt-xxs">
							{ride.driverDetails.name + ' ' + ride.driverDetails.surname}
						</p>
						<p className='card__header-description'>
							<span>{getShortDate(ride.departureDate) ?? 'N/A'}</span>
							<span>&nbsp;|&nbsp;</span>
							<span>{getTime(ride.departureDate) ?? 'N/A'}</span>
						</p>
						<h5 className="card__price">{`$${ride.price}`}</h5>
					</div>
					<div className="col-5">
						<div className="thumbnail__user">
							<UserPicture
								profilePicture={ride.driverDetails.profilePicture}
							/>
						</div>
					</div>
				</div>
      </div>
    </Link>
  );
};

export default RideResultsCard;
