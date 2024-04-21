import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import FormIkUserImage from 'components/forms/FormIkUserImage';
import { itemVariants } from 'utilities/constants/framerVariants';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { where } from 'firebase/firestore';
import { REGISTER_TYPES } from 'utilities/constants/registerTypes';

const RegisterEditUser = ({ authConfig, handleSubmit }) => {
  const { registerType, name, surname, phone, profilePicture } = authConfig;
  const isEditingUser = registerType === REGISTER_TYPES.edit;
  const isRegisteringWithEmail = registerType === REGISTER_TYPES.registerWithEmail;

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

    if (isRegisteringWithEmail) {
      if (!values.email) {
        errors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      } else {
        const userExists = await FirebaseFirestoreService.get('/users', [
          where('email', '==', values.email),
        ]);
        if (userExists?.length > 0) {
          const userExists = 'User mail already exists!';
          errors.email = userExists;
        }
      }
    }

    if (!values.password && isRegisteringWithEmail) {
      errors.password = ['Required'];
    } else if (values.password.length > 0) {
      const passwordErrors = [];
      // if (!/^(?=.*[A-Z])/.test(values.password)) passwordErrors.push('at least one uppercase letter');
      // if (!/^(?=.*[a-z])/.test(values.password)) passwordErrors.push('at least one lowercase letter');
      if (!/^(?=.*\d)/i.test(values.password)) passwordErrors.push('one digit');
      if (!/^(?=.*(\W|_))/i.test(values.password))
        passwordErrors.push('one symbol');
      if (!/.{6,}$/i.test(values.password))
        passwordErrors.push('at least 6 characters long');

      if (passwordErrors.length > 0) {
        errors.password = passwordErrors;
      }
    }

    if (!values.confirmPassword && isRegisteringWithEmail) {
      errors.confirmPassword = 'Required';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }

    if (!values.userType && !isEditingUser) {
      errors.userType = 'Required';
    }

    return errors;
  };

  const submitForm = async (values, { setSubmitting }) => {
    await handleSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        profilePicture: '',
        name: name ?? '',
        surname: surname ?? '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: phone ?? '',
        userType: null,
      }}
      enableReinitialize={true}
      validate={handleValidation}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={submitForm}>
      {({ isSubmitting }) => (
        <Form>
          <motion.div className="form-field profile__img" variants={itemVariants}>
            <Field
              name="profilePicture"
              id="profilePicture"
              component={FormIkUserImage}
              profilePicture={profilePicture}
            />
            <ErrorMessage
              name="profilePicture"
              component="span"
              className="input-message-error"
            />
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
          {isRegisteringWithEmail && (
            <motion.div className="form-field" variants={itemVariants}>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage
                name="email"
                component="span"
                className="input-message-error"
              />
            </motion.div>
          )}
          <motion.div className="form-field" variants={itemVariants}>
            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password">
              {msg => (
                <ul className="list">
                  {msg.map((msgItem, index) => (
                    <li key={index + msgItem}>{msgItem}</li>
                  ))}
                </ul>
              )}
            </ErrorMessage>
          </motion.div>
          <motion.div className="form-field" variants={itemVariants}>
            <Field
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
            />
            <ErrorMessage
              name="confirmPassword"
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
          {!isEditingUser && (
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
          )}
          <motion.button
            className="btn-primary btn-block"
            type="submit"
            disabled={isSubmitting}
            variants={itemVariants}>
            {isEditingUser ? 'Update' : 'Register'}
          </motion.button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterEditUser;
