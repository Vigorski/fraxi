import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import {
  userLogin,
  handleUserLoginWithGoogleAuth,
} from 'store/user/userAsyncActions';
import Layout from 'layout/Layout';
import { REGISTER, REGISTER_OAUTH } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import { useHistory } from 'react-router-dom';
import { IconGoogle } from 'components/icons';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { useEffect } from 'react';
import FirebaseAppInstance from 'services/FirebaseApp';
import { getRedirectResult } from 'firebase/auth';

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const { globalFormError } = useSelector(state => state.errors);
  console.log('Login')
  const handleValidation = values => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Required';
    }

    if (!values.password) {
      errors.password = 'Required';
    }

    return errors;
  };

  const authError = userDetails === null && globalFormError.trim().length !== 0;

  const handleLogin = async (values, { setSubmitting }) => {
    await dispatch(userLogin({ values })).unwrap();
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    const isUserRegistered = await dispatch(handleUserLoginWithGoogleAuth()).unwrap();

    if (!isUserRegistered) {
      history.push(REGISTER_OAUTH.path);
    }
  };

  useEffect(() => {
    async function loginRedirectResult () {
      try {
        const userCredential = await getRedirectResult(FirebaseAppInstance.auth);
        console.log('from redirect', userCredential)
        
      } catch (error) {
        console.log('error:', error)
      }
    }
    loginRedirectResult();
    // return { user: userCredential.user, method: 'google' };
  }, [])

  return (
    <Layout>
      <motion.div
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.h1 className="h1-sm mt-md mb-xxxl" variants={itemVariants}>
          Welcome to Fraxi
        </motion.h1>

        <motion.button
          className="btn-light btn-icon-left btn-block text-initial"
          type="button"
          variants={itemVariants}
          onClick={FirebaseAuthService.loginWithGoogle}>
          <IconGoogle className='text-lg' />
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
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <Field type="password" name="password" placeholder="Password" />
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
            Don't have a Fraxi account? <span className='text-primary text-uppercase'>Sign up</span>
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Login;
