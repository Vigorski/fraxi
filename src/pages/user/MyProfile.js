import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import { IconUserPlaceholder, IconEdit } from '../../components/icons';
import { userLogout } from '../../store/user/userActions';
import { getUserRideHistory } from '../../store/rides/ridesActions';
import PassengerPreferences from './passenger/Preferences';
import { DRIVER, PASSENGER } from '../../utilities/constants/users';

const MyProfile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const routePreferences = userDetails?.routePreferences;

  const handleLogout = () => {
    dispatch(userLogout(history));
  }

  const handleEdit = () => {
    history.push();
  }

  //////////////////////////////////
  // useEffect(() => {
  //   if (userDetails) {
  //     dispatch(getUserRideHistory(userDetails.userId));
  //   }
  // }, [dispatch, userDetails]);
  //////////////////////////////////

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

        <button className="btn-tertiary-ghost btn-block btn-sm mt-xxl" onClick={handleLogout}>Logout</button>
      </section>
		</Layout>
	);
};

export default MyProfile;
