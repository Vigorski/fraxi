import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Layout from 'layout/Layout';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import FormIkUserImage from 'components/forms/FormIkUserImage';
import { userRegisterWithGoogleAuth } from 'store/user/userAsyncActions';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { LOGIN } from 'utilities/constants/routesConfig';

const RegisterOAuth = () => {
  const dispatch = useDispatch();
  const isRegistering = useSelector(state => state.user.isRegistering);

  if (!isRegistering) {
    // page can only be accessed if user is currently in the process of registering
    return <Redirect to={{ pathname: LOGIN.path }} />;
  }

  const user = FirebaseAuthService.getCurrentUser();
  const [name, surname] = user?.displayName?.split(' ');

  const handleValidation = async values => {
    const errors = {};

    if (!!values.profilePicture) {
      const validFileType =
        values.profilePicture.type === 'image/jpeg' ||
        values.profilePicture.type === 'image/png';

      if (!validFileType) {
        errors.profilePicture = 'Not a supported image type';
      }
    }

    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }

    if (!values.surname) {
      errors.surname = 'Required';
    }

    if (!values.userType) {
      errors.userType = 'Required';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    await dispatch(userRegisterWithGoogleAuth({ values })).unwrap();
    setSubmitting(false);
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
        <Formik
          initialValues={{
            name: name ?? '',
            surname: surname ?? '',
            phone: user?.phone ?? '',
            profilePicture: null,
            userType: null,
          }}
          enableReinitialize={true}
          validate={handleValidation}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <motion.div className="form-field profile__img" variants={itemVariants}>
                {!!user?.photoURL ? (
                  <img src={user.photoURL} alt="user avatar" />
                ) : (
                  <>
                    <Field
                      name="profilePicture"
                      id="profilePicture"
                      component={FormIkUserImage}
                    />
                    <ErrorMessage
                      name="profilePicture"
                      component="span"
                      className="input-message-error"
                    />
                  </>
                )}
              </motion.div>

              <motion.div className="form-field" variants={itemVariants}>
                <Field type="text" name="name" placeholder="Name" />
                <ErrorMessage
                  name="name"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <Field type="text" name="surname" placeholder="Last name" />
                <ErrorMessage
                  name="surname"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <Field type="tel" name="phone" placeholder="Phone" />
                <ErrorMessage
                  name="phone"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <h4>What do you want to register as?</h4>
                <div className="input-radio">
                  <Field
                    id="userPassenger"
                    type="radio"
                    name="userType"
                    value="passenger"
                  />
                  <label htmlFor="userPassenger">Passenger</label>
                </div>
                <div className="input-radio">
                  <Field
                    id="userDriver"
                    type="radio"
                    name="userType"
                    value="driver"
                  />
                  <label htmlFor="userDriver">Driver</label>
                </div>
                <ErrorMessage
                  name="userType"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.button
                className="btn-primary btn-block"
                type="submit"
                disabled={isSubmitting}
                variants={itemVariants}>
                Register
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </Layout>
  );
};

export default RegisterOAuth;
