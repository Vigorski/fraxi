import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import FormikUserImage from 'components/forms/FormikUserImage';
import { IconEmail, IconPassword, IconPhone, IconUser } from 'components/icons';
import { itemVariants } from 'utilities/constants/framerVariants';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { where } from 'firebase/firestore';
import { AuthConfig, REGISTER_TYPES } from 'types/auth';
import { FC } from 'react';
import { UserForm } from 'types/user';
import { FormErrors } from 'types/form';

type RegisterEditUserOwnProps = {
  authConfig: AuthConfig;
  handleSubmit: (values: UserForm) => Promise<void>;
};

const RegisterEditUser: FC<RegisterEditUserOwnProps> = ({
  authConfig,
  handleSubmit,
}) => {
  const { registerType, name, surname, phone, profilePicture } = authConfig;
  const isEditingUser = registerType === REGISTER_TYPES.edit;
  const isRegisteringWithEmail =
    registerType === REGISTER_TYPES.registerWithEmail;

  const handleValidation = async (values: UserForm) => {
    const errors: FormErrors<UserForm> = {};

    if (values.profilePicture) {
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
          errors.email = 'User mail already exists!';
        }
      }
    }

    if (!values.password && isRegisteringWithEmail) {
      errors.password = ['Required'];
    } else if (values.password.length > 0) {
      const passwordErrors: string[] = [];
      // if (!/^(?=.*[A-Z])/.test(values.password)) passwordErrors.push('at least one uppercase letter');
      // if (!/^(?=.*[a-z])/.test(values.password)) passwordErrors.push('at least one lowercase letter');
      if (!/^(?=.*\d)/i.test(values.password)) {
        passwordErrors.push('one digit');
      }

      if (!/^(?=.*(\W|_))/i.test(values.password)) {
        passwordErrors.push('one symbol');
      }

      if (!/.{6,}$/i.test(values.password)) {
        passwordErrors.push('at least 6 characters long');
      }

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

  const submitForm = async (
    values: UserForm,
    { setSubmitting }: FormikHelpers<UserForm>,
  ) => {
    await handleSubmit(values);
    setSubmitting(false);
  };

  const initialValues: UserForm = {
    profilePicture: undefined,
    name: name ?? '',
    surname: surname ?? '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: phone ?? '',
    userType: undefined,
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validate={handleValidation}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={submitForm}>
      {({ isSubmitting }) => (
        <Form>
          <motion.div
            className="form-field profile__img"
            variants={itemVariants}>
            <Field
              name="profilePicture"
              id="profilePicture"
              component={FormikUserImage}
              profilePicture={profilePicture}
            />
            <ErrorMessage
              name="profilePicture"
              component="span"
              className="input-message-error"
            />
          </motion.div>
          <motion.div className="form-field" variants={itemVariants}>
            <div className="form-field__icon">
              <IconUser />
              <Field type="text" name="name" placeholder="Name" />
            </div>
            <ErrorMessage
              name="name"
              component="span"
              className="input-message-error"
            />
          </motion.div>
          <motion.div className="form-field" variants={itemVariants}>
            <div className="form-field__icon">
              <IconUser />
              <Field type="text" name="surname" placeholder="Last name" />
            </div>
            <ErrorMessage
              name="surname"
              component="span"
              className="input-message-error"
            />
          </motion.div>
          {isRegisteringWithEmail && (
            <motion.div className="form-field" variants={itemVariants}>
              <div className="form-field__icon">
                <IconEmail className="text-sm" />
                <Field type="email" name="email" placeholder="Email" />
              </div>
              <ErrorMessage
                name="email"
                component="span"
                className="input-message-error"
              />
            </motion.div>
          )}
          <motion.div className="form-field" variants={itemVariants}>
            <div className="form-field__icon">
              <IconPassword />
              <Field type="password" name="password" placeholder="Password" />
            </div>
            <ErrorMessage name="password">
              {msg => {
                const messages: string[] = Array.isArray(msg) ? msg : [msg];
                return (
                  <ul className="list input-message-error">
                    {messages.map((msgItem, index) => (
                      <li key={index + msgItem}>{msgItem}</li>
                    ))}
                  </ul>
                );
              }}
            </ErrorMessage>
          </motion.div>
          <motion.div className="form-field" variants={itemVariants}>
            <div className="form-field__icon">
              <IconPassword />
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
              />
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="span"
              className="input-message-error"
            />
          </motion.div>
          <motion.div className="form-field" variants={itemVariants}>
            <div className="form-field__icon">
              <IconPhone />
              <Field type="tel" name="phone" placeholder="Phone" />
            </div>
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
