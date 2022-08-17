
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import PassengerPreferences from './passenger/Preferences';
import { IconUserPlaceholder, IconEdit } from '../../components/icons';
import { userLogout } from '../../store/user/userActions';

import { DRIVER, PASSENGER } from '../../utilities/constants/users';
import { MY_PROFILE } from '../../utilities/constants/routes';


const MyProfile = ({history}) => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const ridePreferences = userDetails?.ridePreferences;

  const handleLogout = () => {
    dispatch(userLogout(history));
  }

	return (
		<Layout>
			<section className="profile" data-username={`${userDetails?.name} ${userDetails?.surname}`}>
        <div className="profile__edit">
          <Link className="btn-icon-center btn-stripped" to={`${MY_PROFILE.path}/edit-user`}><IconEdit /></Link>
        </div>
        <div className="profile__img">
          <div className="profile__svg-wrapper">
            <IconUserPlaceholder />
          </div>
        </div>
        <h4 className="profile__name">{userDetails?.name} {userDetails?.surname}</h4>

        {userDetails?.userType === PASSENGER &&
          <PassengerPreferences ridePreferences={ridePreferences} />
        }
        {userDetails?.userType === DRIVER &&
          <Link to={`${MY_PROFILE.path}/create-ride`} className="btn-primary btn-block">Create a new ride</Link>
        }

        <button className="btn-primary btn-block btn-sm mt-xxl">Load Rides History</button>
        <button className="btn-primary-ghost btn-block btn-sm mt-xxl" onClick={handleLogout}>Logout</button>
      </section>
		</Layout>
	);
};

export default MyProfile;
