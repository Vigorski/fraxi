import { useLocation } from 'react-router-dom';

import Layout from '../../../components/shared/Layout';
import { getTime, getShortDate } from '../../../utilities/date-time';
import { IconUserPlaceholder } from '../../../components/icons';

const RideDetails = () => {
  const location = useLocation();
  const { rideDetails } = location.state;
  const { driverDetails } = rideDetails;
  const driverHasPicture = driverDetails.profilePicture.length > 0;
  console.log(rideDetails);

  return (
    <Layout>
      <div className="row">
        <div className="col-6">
          {driverHasPicture ? <img src={driverDetails.profilePicture} alt='driver thumbnail' /> : <IconUserPlaceholder />}
        </div>
        <div className="col-6">
          <div>{rideDetails.origin}</div>
          <div>{driverDetails.phone}</div>
          <h3>{`${driverDetails.name} ${driverDetails.surname}`}</h3>
        </div>
      </div>

      <div className='card card--dark card--stats' key={rideDetails.rideId}>  
        <div className="card__header">
          <div className="card__section card__section--border-dashed card__decorated">
            <p>{rideDetails.originAbbr ?? 'N/A'}</p>
            <div className="card__decorated-dash" />
            <i className="icon-car-ride icon-md" />
            <div className="card__decorated-dash" />
            <p>{rideDetails.destinationAbbr ?? 'N/A'}</p>
          </div>
        </div>
        <div className="card__body">
          <div className='card__section'>
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
          <div className="card__section">
            <dl className="list-desc__rows">
              <div className="list-desc__row">
                <dt>Passengers</dt>
                <dd className="text-center">{`${rideDetails.passengers.length} / ${rideDetails.maxPassengers}`}</dd>
              </div>
              <div className="list-desc__row">
                <dt>Driver</dt>
                <dd className="text-center">{driverDetails.name}</dd>
              </div>
              <div className="list-desc__row">
                <dt>Route</dt>
                <dd className="text-center">{rideDetails.rideType}</dd>
              </div>
              <div className="list-desc__row">
                <dt>Smoking</dt>
                <dd className="text-center">{`${rideDetails.smoking ? 'Yes' : 'No'}`}</dd>
              </div>
              <div className="list-desc__row">
                <dt># of stops</dt>
                <dd className="text-center">{rideDetails.passengers.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <button className="btn-primary">Book ride</button>
    </Layout>
  );
}

// {driverHasPicture ? <img src={ride.driverDetails.profilePicture} alt='driver thumbnail' /> : <IconUserPlaceholder />}

export default RideDetails;