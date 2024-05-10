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
import { IconGoogle, IconPassword, IconUser } from 'components/icons';

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const { globalFormError } = useSelector(state => state.errors);

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
    const isUserRegistered = await dispatch(
      handleUserLoginWithGoogleAuth(),
    ).unwrap();

    if (!isUserRegistered) {
      history.push(REGISTER_OAUTH.path);
    }
  };

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
