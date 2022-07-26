import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import { IconUserPlaceholder, IconEdit } from '../../components/icons';
import { userLogout } from '../../store/user/userActions';
import { getUserActiveRides } from '../../store/rides/ridesActions';
import PassengerPreferences from './passenger/Preferences';
import { DRIVER, PASSENGER } from '../../utilities/constants/users';

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
          <button className="btn-icon-center btn-stripped" onClick={handleEdit}><IconEdit /></button>
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
          <Link to="/my-profile/create-ride" className="btn-tertiary btn-block">Create a new ride</Link>
        }

        <div className="card__wrapper">
          {activeRides.length > 0 &&
            activeRides.map((ride) => {
              return (
                <div className='card card--dark card--stats card--expandable' key={ride.rideId}>  
                  <div className="card__header">
                    <div className='card__section card__section--border-dashed card__decorated'>
                      <p>{ride.originAbbr ?? 'N/A'}</p>
                      <div className="card__decorated-dash" />
                      <i className="icon-car-ride icon-md" />
                      <div className="card__decorated-dash" />
                      <p>{ride.destinationAbbr ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div className="card__body">
                    <div className='card__section'>
                      <dl className='list-desc__rows'>
                        <div className='list-desc__row'>
                          <dt>Departure</dt>
                          <dd>{ride.departureDate ?? 'N/A'}</dd>
                        </div>
                        <div className='list-desc__row'>
                          <dt>Price</dt>
                          <dd>{ride.price ?? 'N/A'}</dd>
                        </div>
                        <div className='list-desc__row'>
                          <dt>Smoking</dt>
                          <dd>{ride.smoking ? 'smoking' : 'non-smoking'}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        <button className="btn-tertiary-ghost btn-block btn-sm mt-xxl" onClick={handleLogout}>Logout</button>
      </section>
		</Layout>
	);
};

export default MyProfile;
