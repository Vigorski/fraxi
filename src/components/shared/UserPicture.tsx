import { FC } from 'react';
import { IconUserPlaceholder } from 'components/icons';

type UserPictureOwnProps = {
	profilePicture?: string
}

const UserPicture: FC<UserPictureOwnProps> = ({ profilePicture }) => {
  if (profilePicture) {
    return <img src={profilePicture} alt="user thumbnail" />;
  }

  return <IconUserPlaceholder />;
};

export default UserPicture;
