import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import FormIKSelect from 'components/forms/FormIKSelect';
import Layout from 'layout/Layout';
import { updateRidePreferences } from 'store/user/userAsyncActions';
import { MKD_CITIES } from 'utilities/constants/cities';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import {
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE,
  SMOKING,
  SMOKING_LABEL,
} from 'utilities/constants/rides';

const EditMyPreferences = () => {
  const history = useHistory();
  const { userDetails } = useSelector(state => state.user);
  const ridePreferences = userDetails?.ridePreferences;
  const dispatch = useDispatch();

  const handleValidation = values => {
    const errors = {};

    if (
      values.maxPassengers === '' ||
      values.maxPassengers === undefined ||
      values.maxPassengers === null
    ) {
      errors.maxPassengers = 'Required';
    }

    return errors;
  };

  const citiesOptions = MKD_CITIES.map(city => {
    return { value: city, label: city };
  });

  const isRidePreferencesValid =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  return (
    <Layout>
      <motion.section
        className="profile profile--edit"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <Formik
          initialValues={{
            origin: isRidePreferencesValid ? ridePreferences.origin : '',
            destination: isRidePreferencesValid
              ? ridePreferences.destination
              : '',
            maxPassengers: isRidePreferencesValid
              ? ridePreferences.maxPassengers
              : MAX_PASSENGERS.noPreference,
            rideType: isRidePreferencesValid
              ? ridePreferences.rideType
              : RIDE_TYPE.noPreference,
            smoking: isRidePreferencesValid
              ? ridePreferences.smoking
              : SMOKING.noPreference,
          }}
          validate={handleValidation}
          onSubmit={async (values, { setSubmitting }) => {
            await dispatch(
              updateRidePreferences({ userId: userDetails.userId, values }),
            ).then(res => {
              history.push(MY_PROFILE.path);
              setSubmitting(false);
            });
          }}>
          {({ isSubmitting }) => (
            <Form>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="origin">Your usual pick up location</label>
                <Field
                  name="origin"
                  id="origin"
                  component={FormIKSelect}
                  options={citiesOptions}
                />
                <ErrorMessage
                  name="origin"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="destination">Your usual destination</label>
                <Field
                  name="destination"
                  id="destination"
                  component={FormIKSelect}
                  options={citiesOptions}
                />
                <ErrorMessage
                  name="destination"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="maxPassengers">
                  Maximum number of passengers
                </label>
                <Field
                  name="maxPassengers"
                  id="maxPassengers"
                  component={FormIKSelect}
                  options={[
                    {
                      value: MAX_PASSENGERS.noPreference,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.noPreference],
                    },
                    {
                      value: MAX_PASSENGERS.one,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.one],
                    },
                    {
                      value: MAX_PASSENGERS.two,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.two],
                    },
                    {
                      value: MAX_PASSENGERS.three,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.three],
                    },
                    {
                      value: MAX_PASSENGERS.four,
                      label: MAX_PASSENGERS_LABEL[MAX_PASSENGERS.four],
                    },
                  ]}
                />
                <ErrorMessage
                  name="maxPassengers"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="rideType">Type of ride</label>
                <Field
                  name="rideType"
                  id="rideType"
                  component={FormIKSelect}
                  options={[
                    {
                      value: SMOKING.noPreference,
                      label: SMOKING_LABEL[SMOKING.noPreference],
                    },
                    {
                      value: SMOKING.noSmoking,
                      label: SMOKING_LABEL[SMOKING.noSmoking],
                    },
                    {
                      value: SMOKING.smoking,
                      label: SMOKING_LABEL[SMOKING.smoking],
                    },
                  ]}
                />
                <ErrorMessage
                  name="rideType"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>
              <motion.div className="form-field" variants={itemVariants}>
                <label htmlFor="smoking">Smoking</label>
                <Field
                  name="smoking"
                  id="smoking"
                  component={FormIKSelect}
                  options={[
                    {
                      value: SMOKING.noPreference,
                      label: SMOKING_LABEL[SMOKING.noPreference],
                    },
                    {
                      value: SMOKING.noSmoking,
                      label: SMOKING_LABEL[SMOKING.noSmoking],
                    },
                    {
                      value: SMOKING.smoking,
                      label: SMOKING_LABEL[SMOKING.smoking],
                    },
                  ]}
                />
                <ErrorMessage
                  name="smoking"
                  component="span"
                  className="input-message-error"
                />
              </motion.div>

              <motion.button
                className="btn-primary btn-block mt-xl"
                type="submit"
                disabled={isSubmitting}
                variants={itemVariants}>
                Save
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.section>
    </Layout>
  );
};

export default EditMyPreferences;
