import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import { MY_PROFILE } from '../../utilities/constants/routes';
import { IconUserPlaceholder } from '../../components/icons';

const MyProfile = () => {
	const { userDetails } = useSelector(state => state.user);
  const routePreferences = userDetails.routePreferences;

	return (
		<Layout>
			<section className="profile" data-username={`${userDetails.name} ${userDetails.surname}`}>
        <div className="profile__img">
          <div className="profile__svg-wrapper">
            <IconUserPlaceholder />
          </div>
        </div>
        <h4 className="profile__name">{userDetails.name} {userDetails.surname}</h4>

        <Link to={`${MY_PROFILE}/edit-preferences`}>Edit Preferences</Link>
        <dl>
          <dt>Origin</dt>
          <dd>{routePreferences !== undefined ? routePreferences.origin : 'N/A'}</dd>
          <dt>Destination</dt>
          <dd>{routePreferences !== undefined ? routePreferences.destination : 'N/A'}</dd>
          <dt># of Stops</dt>
          <dd>{routePreferences !== undefined ? routePreferences.numOfStops : 'N/A'}</dd>
          <dt>Route</dt>
          <dd>{routePreferences !== undefined ? routePreferences.routeType : 'N/A'}</dd>
          <dt>Smoking</dt>
          <dd>{routePreferences !== undefined ? routePreferences.smoking : 'N/A'}</dd>
        </dl>
      </section>
		</Layout>
	);
};

export default MyProfile;
