import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { motion } from 'framer-motion';
import EditMyPreferencesForm from 'components/user/passenger/EditMyPreferencesForm';
import GoogleMapsLoader from 'components/shared/GoogleMapsLoader';
import Layout from 'layout/Layout';
import { updateRidePreferences } from 'store/user/userAsyncActions';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import { mainContainerVariants } from 'utilities/constants/framerVariants';
import { MAX_PASSENGERS, RIDE_TYPE, SMOKING } from 'types/ride';

const EditMyPreferences = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const ridePreferences = userDetails?.ridePreferences;

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

  const isRidePreferencesValid =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  const initialValues = {
    origin: isRidePreferencesValid ? ridePreferences.origin : '',
    destination: isRidePreferencesValid ? ridePreferences.destination : '',
    maxPassengers: isRidePreferencesValid
      ? ridePreferences.maxPassengers
      : MAX_PASSENGERS.noPreference,
    rideType: isRidePreferencesValid
      ? ridePreferences.rideType
      : RIDE_TYPE.noPreference,
    smoking: isRidePreferencesValid
      ? ridePreferences.smoking
      : SMOKING.noPreference,
  };

  const submitHandler = async (values, { setSubmitting }) => {
    await dispatch(
      updateRidePreferences({ userId: userDetails.userId, values }),
    ).unwrap();

    navigate(MY_PROFILE.path);
    setSubmitting(false);
  };

  return (
    <GoogleMapsLoader>
      <Layout>
        <motion.section
          className="profile profile--edit"
          variants={mainContainerVariants}
          initial="initial"
          animate="visible"
          exit="hidden">
          <Formik
            initialValues={initialValues}
            validate={handleValidation}
            onSubmit={submitHandler}>
            <EditMyPreferencesForm />
          </Formik>
        </motion.section>
      </Layout>
    </GoogleMapsLoader>
  );
};

export default EditMyPreferences;
