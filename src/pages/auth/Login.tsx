import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { IconGoogle, IconPassword, IconUser } from 'components/icons';
import Layout from 'layout/Layout';
import {
  userLogin,
  handleUserLoginWithGoogleAuth,
} from 'store/user/userAsyncActions';
import { REGISTER, REGISTER_OAUTH } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import FraxiLogoWhite from '../../assets/logo/fraxi-logo-white.png';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { AuthLogin } from 'types/auth';
import { FormErrors } from 'types/form';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(state => state.user);
  const { globalFormError } = useAppSelector(state => state.errors);

  const handleValidation = (values: AuthLogin) => {
    const errors: FormErrors<AuthLogin> = {};

    if (!values.email) {
      errors.email = 'Required';
    }

    if (!values.password) {
      errors.password = 'Required';
    }

    return errors;
  };

  const authError = userDetails === null && globalFormError.trim().length !== 0;

  const handleLogin = async (
    values: AuthLogin,
    { setSubmitting }: FormikHelpers<AuthLogin>,
  ) => {
    await dispatch(userLogin({ values })).unwrap();
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    const isUserRegistered = await dispatch(
      handleUserLoginWithGoogleAuth(),
    ).unwrap();

    if (!isUserRegistered) {
      navigate(REGISTER_OAUTH.path);
    }
  };

  return (
    <Layout>
      <motion.div
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.div className="branding-auth" variants={itemVariants}>
          <div className="branding-auth__logo">
            <img src={FraxiLogoWhite} alt="fraxi logo" />
          </div>
          <h1 className="h1-xs branding-auth__moto">Welcome to Fraxi</h1>
        </motion.div>

        <motion.button
          className="btn-light btn-icon-left btn-block text-initial"
          type="button"
          variants={itemVariants}
          onClick={handleGoogleLogin}>
          <IconGoogle className="text-lg" />
          <span>Continue with Google</span>
        </motion.button>

        <motion.div className="divider" variants={itemVariants}>
          <span>OR</span>
        </motion.div>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={handleValidation}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleLogin}>
          {({ isSubmitting }) => (
            <Form>
              {authError && (
                <div className="form-field">
                  <span className="input-message-error">{globalFormError}</span>
                </div>
              )}
              <motion.div className="form-field" variants={itemVariants}>
                <div className="form-field__icon">
                  <IconUser />
                  <Field type="email" name="email" placeholder="Email" />
                </div>
                <ErrorMessage
                  name="email"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <div className="form-field__icon">
                  <IconPassword />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.button
                className="btn-primary btn-block"
                type="submit"
                disabled={isSubmitting}
                variants={itemVariants}>
                Next
              </motion.button>
            </Form>
          )}
        </Formik>

        <motion.div variants={itemVariants}>
          <Link className="link-register" to={REGISTER.path}>
            Don't have a Fraxi account?{' '}
            <span className="text-primary text-uppercase">Sign up</span>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Login;
