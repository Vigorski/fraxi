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
      className="card card__ride card--gray">
      <div className="card__body">
        <div className="card__section card__ride-info card__radius--top pb-0">
          <div className="row">
            <div className="col-7">
              <h6>
                {ride.driverDetails.name + ' ' + ride.driverDetails.surname}
              </h6>
              <p>{getShortDate(ride.departureDate) ?? 'N/A'}</p>
              <p>{getTime(ride.departureDate) ?? 'N/A'}</p>
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
        <div className="card__stamp">
          <div className="card__stamp-border" />
        </div>
        <div className="card__section card__ride-price card__radius--bottom pt-0">
          <div className="row">
            <div className="col-7">
              <h6>Price</h6>
            </div>
            <div className="col-5">
              <h6>${ride.price}</h6>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RideResultsCard;
