import { Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import FormikSelect from 'components/forms/FormikSelect';
import FormAutocomplete from 'components/forms/FormAutocomplete';
import useFormContextRidePreferences from 'hooks/useFormContextRidePreferences';
import { itemVariants } from 'utilities/constants/framerVariants';
import {
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  SMOKING,
  SMOKING_LABEL,
} from 'types/ride';
import { AcRefType } from 'types/form'; 

const EditMyPreferencesForm = () => {
  const [formikProps, setLocation] = useFormContextRidePreferences();

  const handleOriginCityChange = (acRef: AcRefType) => {
    setLocation(acRef, 'origin');
  };

  const handleDestinationCityChange = (acRef: AcRefType) => {
    setLocation(acRef, 'destination');
  };

  return (
    <Form>
      <FormAutocomplete
        name="origin"
        label="Your usual pick up location"
        handler={handleOriginCityChange}
        types={['(cities)']}
        placeholder={formikProps.initialValues.origin ?? ''}
      />
      <FormAutocomplete
        name="destination"
        label="Your usual destination"
        handler={handleDestinationCityChange}
        types={['(cities)']}
        placeholder={formikProps.initialValues.destination ?? ''}
      />
      <motion.div className="form-field" variants={itemVariants}>
        <label htmlFor="maxPassengers">Maximum number of passengers</label>
        <Field
          name="maxPassengers"
          id="maxPassengers"
          component={FormikSelect}
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
          component={FormikSelect}
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
          component={FormikSelect}
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
        disabled={formikProps.isSubmitting}
        variants={itemVariants}>
        Save
      </motion.button>
    </Form>
  );
};

export default EditMyPreferencesForm;
