import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import { MY_PROFILE } from '../../utilities/constants/routes';

const MyProfile = () => {
	const { userDetails } = useSelector(state => state.user);

	return (
		<Layout>
			<section className="profile" data-username='John Jenner'>
        <div className="profile__img">
          placeholder
        </div>
        <h4 className="profile__name">{userDetails.name} {userDetails.surname}</h4>

        <Link to={`${MY_PROFILE}/edit-preferences`}>Edit Preferences</Link>
        <dl>
          <dt># of Stops</dt>
          <dd>1</dd>
          <dt>Route</dt>
          <dd>Regular</dd>
          <dt>Smoking</dt>
          <dd>No Smoking</dd>
        </dl>
      </section>
		</Layout>
	);
};

export default MyProfile;
