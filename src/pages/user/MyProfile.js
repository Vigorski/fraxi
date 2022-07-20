import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Layout from '../../components/shared/Layout';
import { MY_PROFILE } from '../../utilities/constants/routes';
import { IconUserPlaceholder } from '../../components/icons';
import { userLogout } from '../../store/user/userActions';

const MyProfile = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const routePreferences = userDetails?.routePreferences;

  const handleLogout = () => {
    dispatch(userLogout(history));
  }

	return (
		<Layout>
			<section className="profile" data-username={`${userDetails?.name} ${userDetails?.surname}`}>
        <div className="profile__img">
          <div className="profile__svg-wrapper">
            <IconUserPlaceholder />
          </div>
        </div>
        <h4 className="profile__name">{userDetails?.name} {userDetails?.surname}</h4>

        <div className="card card--stats">
          <Tabs>
            <div className="card__tabs card__section--clip card__section--border-dashed">
              <TabList>
                <Tab>Preferences</Tab>
                <Tab>Saved drivers</Tab>
              </TabList>
            </div>
            <TabPanel>
              <div className="card__section card__section card__section--clip card__section--border-dashed text-center">
                <Link to={`${MY_PROFILE}/edit-preferences`}>Edit Preferences</Link>
              </div>
              <div className="card__section card__section--border-dashed">
                <dl className="list-desc__columns profile__routes">
                  <div className="list-desc__col">
                    <dt>Origin</dt>
                    <dd>{routePreferences !== undefined ? routePreferences.origin : 'N/A'}</dd>
                  </div>
                  <div className="list-desc__col">
                    <dt>Destination</dt>
                    <dd>{routePreferences !== undefined ? routePreferences.destination : 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              <div className="card__section">
                <dl className="list-desc__rows">
                  <div className="list-desc__row">
                    <dt># of Stops</dt>
                    <dd>{routePreferences !== undefined ? routePreferences.numOfStops : 'N/A'}</dd>
                  </div>
                  <div className="list-desc__row">
                    <dt>Route</dt>
                    <dd>{routePreferences !== undefined ? routePreferences.routeType : 'N/A'}</dd>
                  </div>
                  <div className="list-desc__row">
                    <dt>Smoking</dt>
                    <dd>{routePreferences !== undefined ? routePreferences.smoking : 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </TabPanel>
            <TabPanel>
              saved drivers here
            </TabPanel>
          </Tabs>  
        </div>
        
        <button className="btn-tertiary-ghost btn-block btn-sm mt-xxl" onClick={handleLogout}>Logout</button>
      </section>
		</Layout>
	);
};

export default MyProfile;
