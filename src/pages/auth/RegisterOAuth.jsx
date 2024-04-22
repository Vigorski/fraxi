import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import { userRegisterWithGoogleAuth } from 'store/user/userAsyncActions';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { LOGIN } from 'utilities/constants/routesConfig';
import { REGISTER_TYPES } from 'utilities/constants/registerTypes';
import RegisterEditUser from 'components/auth/RegisterEditUser';

const RegisterOAuth = () => {
  const dispatch = useDispatch();
  const isRegistering = useSelector(state => state.user.isRegistering);

  if (!isRegistering) {
    // page can only be accessed if user is currently in the process of registering
    return <Redirect to={{ pathname: LOGIN.path }} />;
  }

  const user = FirebaseAuthService.getCurrentUser();
  const [name, surname] = user?.displayName?.split(' ');
  const oAuthUserConfig = {
    registerType: REGISTER_TYPES.registerWithOAuth,
    name,
    surname,
    phone: user.phone,
    profilePicture: user.photoURL
  }

  const handleSubmitOAuthRegister = async (values) => {
    await dispatch(userRegisterWithGoogleAuth({ values })).unwrap();
  };

  return (
    <Layout>
      <motion.div
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.h1 className="h1-sm mb-xxl" variants={itemVariants}>
          Complete your profile
        </motion.h1>
        <RegisterEditUser authConfig={oAuthUserConfig} handleSubmit={handleSubmitOAuthRegister} />
      </motion.div>
    </Layout>
  );
};

export default RegisterOAuth;
