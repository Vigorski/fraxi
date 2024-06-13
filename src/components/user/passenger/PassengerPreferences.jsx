import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE_LABEL,
  SMOKING_LABEL,
} from 'types/rides';
import { MY_PROFILE } from 'utilities/constants/routesConfig';

const PassengerPreferences = () => {
  const { userDetails } = useSelector(state => state.user);
  const { origin, destination, maxPassengers, rideType, smoking } =
    userDetails?.ridePreferences ?? {};

  return (
    <>
      <div className="card__section text-center pb-0">
        <Link to={`${MY_PROFILE.path}/edit-preferences`}>Edit Preferences</Link>
      </div>
      <div className="card__stamp">
        <div className="card__stamp-border" />
      </div>
      <div className="card__section pv-0">
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
      <div className="card__stamp">
        <div className="card__stamp-border" />
      </div>
      <div className="card__section card__radius--bottom pt-0">
        <dl className="list-desc__rows">
          <div className="list-desc__row">
            <dt># of Stops</dt>
            <dd>{MAX_PASSENGERS_LABEL[maxPassengers]}</dd>
          </div>
          <div className="list-desc__row">
            <dt>Type of ride</dt>
            <dd>{RIDE_TYPE_LABEL[rideType]}</dd>
          </div>
          <div className="list-desc__row">
            <dt>Smoking</dt>
            <dd>{SMOKING_LABEL[smoking]}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

export default PassengerPreferences;
