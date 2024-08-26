import { useNavigate } from 'react-router-dom';
import { Formik, FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import EditMyPreferencesForm from 'components/user/passenger/EditMyPreferencesForm';
import GoogleMapsLoader from 'components/shared/GoogleMapsLoader';
import Layout from 'layout/Layout';
import { updateRidePreferences } from 'store/user/userAsyncActions';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import { mainContainerVariants } from 'utilities/constants/framerVariants';
import {
  MAX_PASSENGERS,
  RIDE_TYPE,
  RidePreferences,
  SMOKING,
} from 'types/ride';
import { FormErrors } from 'types/form';
import { useAppSelector } from 'hooks/useAppSelector';
import { useAppDispatch } from 'hooks/useAppDispatch';

const EditMyPreferences = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(state => state.user);
  const ridePreferences = userDetails?.ridePreferences;

  const handleValidation = (values: RidePreferences) => {
    const errors: FormErrors<RidePreferences> = {};

    if (values.maxPassengers === undefined || values.maxPassengers === null) {
      errors.maxPassengers = 'Required';
    }

    return errors;
  };

  const isRidePreferencesValid =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  const initialValues: RidePreferences = {
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

  const handleSubmit = async (
    values: RidePreferences,
    { setSubmitting }: FormikHelpers<RidePreferences>,
  ) => {
    if (userDetails) {
      await dispatch(
        updateRidePreferences({ userId: userDetails.userId, values }),
      ).unwrap();

      navigate(MY_PROFILE.path);
      setSubmitting(false);
    }
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
            onSubmit={handleSubmit}>
            <EditMyPreferencesForm />
          </Formik>
        </motion.section>
      </Layout>
    </GoogleMapsLoader>
  );
};

export default EditMyPreferences;
