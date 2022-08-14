import { getTime, getShortDate } from '../../utilities/date-time';
import { IconUserPlaceholder } from '../../components/icons';

const RideResults = ({filteredRides}) => {
  return (
    <div className='card__wrapper'>
      {filteredRides.length > 0 &&
        filteredRides.map(ride => {
          const driverHasPicture = ride.driverDetails.profilePicture.length > 0;
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
                        {driverHasPicture ? 
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
  );
}

export default RideResults;