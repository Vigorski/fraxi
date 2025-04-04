import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks/useAppSelector';
import {
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE,
  RIDE_TYPE_LABEL,
  SMOKING,
  SMOKING_LABEL,
} from 'types/ride';
import { RidePreferences } from 'types/ride';
import { MY_PROFILE } from 'utilities/constants/routesConfig';

const PassengerPreferences = () => {
  const userDetails = useAppSelector(state => state.user.userDetails);
  const { origin, destination, maxPassengers, rideType, smoking } =
    (userDetails?.ridePreferences as RidePreferences) ?? {};

  return (
    <div className="card card--stats">
			<div className="card__section text-center mt-0">
        <Link className='btn-primary btn-sm' to={`${MY_PROFILE.path}/edit-preferences`}>Edit Preferences</Link>
      </div>
      <div className="card__section">
        <dl className="list-desc__columns profile__routes">
          <div className="list-desc__col">
            <dt>Origin</dt>
            <dd>{origin ?? 'N/A'}</dd>
          </div>
          <div className="list-desc__col">
            <dt>Destination</dt>
            <dd>{destination ?? 'N/A'}</dd>
          </div>
        </dl>
      </div>
      <div className="card__section mb-0">
        <dl className="list-desc__rows">
          <div className="list-desc__row">
            <dt># of Stops</dt>
            <dd>{MAX_PASSENGERS_LABEL[maxPassengers as MAX_PASSENGERS]}</dd>
          </div>
          <div className="list-desc__row">
            <dt>Type of ride</dt>
            <dd>{RIDE_TYPE_LABEL[rideType as RIDE_TYPE]}</dd>
          </div>
          <div className="list-desc__row">
            <dt>Smoking</dt>
            <dd>{SMOKING_LABEL[smoking as SMOKING]}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PassengerPreferences;
