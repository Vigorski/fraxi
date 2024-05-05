import { IconUserPlaceholder } from 'components/icons';

const UserPicture = ({ profilePicture }) => {
  if (profilePicture !== '') {
    return <img src={profilePicture} alt="user thumbnail" />;
  }

  return <IconUserPlaceholder />;
};

export default UserPicture;
