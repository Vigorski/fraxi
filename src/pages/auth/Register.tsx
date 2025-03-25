import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import RegisterEditUser from 'components/auth/RegisterEditUser';
import { userRegister } from 'store/user/userAsyncActions';
import { LOGIN } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import { AuthConfig, REGISTER_TYPES } from 'types/auth';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { UserForm } from 'types/user';

const Register = () => {
  const dispatch = useAppDispatch();
  const registerUserConfig: AuthConfig = {
    registerType: REGISTER_TYPES.registerWithEmail,
  };

  const handleSubmitRegister = async (values: UserForm) => {
    await dispatch(userRegister({ values })).unwrap();
  };

  return (
    <Layout>
      <motion.div
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.h1 className="h1-sm mt-md mb-xxl" variants={itemVariants}>
          Create Your Account
        </motion.h1>

        <RegisterEditUser
          authConfig={registerUserConfig}
          handleSubmit={handleSubmitRegister}
        />

        <motion.div className="divider" variants={itemVariants}>
          <span>OR</span>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link className="btn-primary-ghost btn-block" to={LOGIN.path}>
            Sign in
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Register;
