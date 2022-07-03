import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LOGIN } from '../../utilities/constants/routes';

const UserProfile = () => {
  const history = useHistory();
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    history.replace(LOGIN);
  }

  return (
    <div>user Profile</div>
  );
}

export default UserProfile;