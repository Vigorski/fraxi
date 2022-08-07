import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import { IconUserPlaceholder, IconEdit } from '../../components/icons';
import PassengerPreferences from './passenger/Preferences';
import { userLogout } from '../../store/user/userActions';
import { getUserActiveRides } from '../../store/rides/ridesActions';
import { DRIVER, PASSENGER } from '../../utilities/constants/users';
import { MY_PROFILE } from '../../utilities/constants/routes';
import { getTime, getShortDate } from '../../utilities/date-time';

const MyProfile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const { activeRides } = useSelector(state => state.rides);
  const routePreferences = userDetails?.routePreferences;

  const handleLogout = () => {
    dispatch(userLogout(history));
  }

  const handleEdit = () => {
    history.push();
  }

  useEffect(() => {
    if (userDetails) {
      dispatch(getUserActiveRides(userDetails.userId));
    }
  }, [dispatch, userDetails]);

	return (
		<Layout>
			<section className="profile" data-username={`${userDetails?.name} ${userDetails?.surname}`}>
        <div className="profile__edit">
          <Link className="btn-icon-center btn-stripped" to={`${MY_PROFILE.path}/edit-user`} onClick={handleEdit}><IconEdit /></Link>
        </div>
        <div className="profile__img">
          <div className="profile__svg-wrapper">
            <IconUserPlaceholder />
          </div>
        </div>
        <h4 className="profile__name">{userDetails?.name} {userDetails?.surname}</h4>

        {userDetails?.userType === PASSENGER &&
          <PassengerPreferences routePreferences={routePreferences} />
        }
        {userDetails?.userType === DRIVER &&
          <Link to={`${MY_PROFILE.path}/create-ride`} className="btn-primary btn-block">Create a new ride</Link>
        }

        <div className="card__wrapper">
          {activeRides.length > 0 &&
            activeRides.map((ride) => {
              return (
                <div className='card card--dark card--stats' key={ride.rideId}>  
                  <div className="card__header">
                    <div className={`card__section card__section--border-dashed card__decorated card__decorated--${ride.status}`}>
                      <p>{ride.originAbbr ?? 'N/A'}</p>
                      <div className="card__decorated-dash" />
                      <i className="icon-car-ride icon-md" />
                      <div className="card__decorated-dash" />
                      <p>{ride.destinationAbbr ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div className="card__body">
                    <div className='card__section'>
                      <dl className='list-desc__columns row'>
                        <div className='list-desc__col text-center'>
                          <dt>Departure</dt>
                          <dd>{`${getShortDate(ride.departureDate) ?? 'N/A'} • ${getTime(ride.departureDate) ?? 'N/A'}`}</dd>
                        </div>
                        <div className='list-desc__col text-center'>
                          <dt>Passengers</dt>
                          <dd>{`${ride.passengers.length}/${ride.maxPassengers}`}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        <button className="btn-primary btn-block btn-sm mt-xxl">Load Rides History</button>
        <button className="btn-primary-ghost btn-block btn-sm mt-xxl" onClick={handleLogout}>Logout</button>
      </section>
		</Layout>
	);
};

export default MyProfile;
