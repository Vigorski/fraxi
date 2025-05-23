import { useNavigate } from 'react-router-dom';
import { userUpdate } from 'store/user/userAsyncActions';
import RegisterEditUser from '../../components/auth/RegisterEditUser';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import { AuthConfig, REGISTER_TYPES } from 'types/auth';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { UserForm } from 'types/user';
import MotionWrapper from 'components/shared/MotionWrapper';

const EditMyProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userDetails = useAppSelector(state => state.user.userDetails);
  const editUserConfig: AuthConfig = {
    registerType: REGISTER_TYPES.edit,
    name: userDetails?.name,
    surname: userDetails?.surname,
    phone: userDetails?.phone,
    profilePicture: userDetails?.profilePicture,
  };

  const handleSubmitEdit = async (values: UserForm) => {
    if (userDetails) {
      await dispatch(
        userUpdate({ userId: userDetails.userId, values }),
      ).unwrap();
      navigate(MY_PROFILE.path);
    }
  };

  return (
    <MotionWrapper className="profile profile--edit">
			<RegisterEditUser
				authConfig={editUserConfig}
				handleSubmit={handleSubmitEdit}
			/>
    </MotionWrapper>
  );
};

export default EditMyProfile;
