import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { itemVariants } from 'utilities/constants/framerVariants';
import { userRegisterWithGoogleAuth } from 'store/user/userAsyncActions';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { LOGIN } from 'utilities/constants/routesConfig';
import { AuthConfig, REGISTER_TYPES } from 'types/auth';
import RegisterEditUser from 'components/auth/RegisterEditUser';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { UserForm } from 'types/user';
import MotionWrapper from 'components/shared/MotionWrapper';

const RegisterOAuth = () => {
  const dispatch = useAppDispatch();
  const isRegistering = useAppSelector(state => state.user.isRegistering);

  if (!isRegistering) {
    // page can only be accessed if user is currently in the process of registering
    return <Navigate to={{ pathname: LOGIN.path }} />;
  }

  const user = FirebaseAuthService.getCurrentUser();
  const [name = '', surname = ''] = user?.displayName?.split(' ') ?? [];
  const oAuthUserConfig: AuthConfig = {
    registerType: REGISTER_TYPES.registerWithOAuth,
    name,
    surname,
    phone: user?.phoneNumber ?? undefined,
    profilePicture: user?.photoURL ?? undefined,
  };

  const handleSubmitOAuthRegister = async (values: UserForm) => {
    await dispatch(userRegisterWithGoogleAuth({ values })).unwrap();
  };

  return (
    <MotionWrapper as="div">
      <>
        <motion.h1 className="h1-sm mb-xxl" variants={itemVariants}>
          Complete your profile
        </motion.h1>
        <RegisterEditUser
          authConfig={oAuthUserConfig}
          handleSubmit={handleSubmitOAuthRegister}
        />
      </>
    </MotionWrapper>
  );
};

export default RegisterOAuth;
