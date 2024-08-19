import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import FormikSelect from 'components/forms/FormikSelect';
import FormAutocomplete from 'components/forms/FormAutocomplete';
import { IconFilters, IconClearFilters } from 'components/icons';
import useFormContextRidePreferences from 'hooks/useFormContextRidePreferences';
import { itemVariants } from 'utilities/constants/framerVariants';
import {
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE,
  RIDE_TYPE_LABEL,
  SMOKING,
  SMOKING_LABEL,
} from 'types/ride';
import { AcRefType } from 'types/form';

const RideFilters = () => {
  const [expandFilters, setExpandFilters] = useState(false);
  const [formikProps, setLocation] = useFormContextRidePreferences();

  const toggleFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setExpandFilters(!expandFilters);
  };

  const handleOriginCityChange = (acRef: AcRefType) => {
    setLocation(acRef, 'origin');
  };

  const handleDestinationCityChange = (acRef: AcRefType) => {
    setLocation(acRef, 'destination');
  };

  const handleClearForm = () => {
    formikProps.setFieldValue('origin', '');
    formikProps.setFieldValue('destination', '');
    formikProps.setFieldValue('maxPassengers', MAX_PASSENGERS.noPreference);
    formikProps.setFieldValue('rideType', RIDE_TYPE.noPreference);
    formikProps.setFieldValue('smoking', SMOKING.noPreference);

    // this part is not good practice
    // will be removed once custom autocomplete component is finished
    // TODO: Create custom Autocomplete component
    const originInput = document.querySelector(
      'input#origin',
    ) as HTMLInputElement;
    const destinationInput = document.querySelector(
      'input#destination',
    ) as HTMLInputElement;
    originInput.value = '';
    originInput.placeholder = '';
    destinationInput.value = '';
    destinationInput.placeholder = '';
  };

  return (
    <>
      <motion.div className="filters__route" variants={itemVariants}>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}>
          <FormAutocomplete
            name="origin"
            label="Origin"
            handler={handleOriginCityChange}
            types={['(cities)']}
            placeholder={formikProps.initialValues.origin ?? ''}
            className="filters__autocomplete"
          />
        </motion.div>
        <div className="filters__dash" />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}>
          <FormAutocomplete
            name="destination"
            label="Destination"
            handler={handleDestinationCityChange}
            types={['(cities)']}
            placeholder={formikProps.initialValues.destination ?? ''}
            className="filters__autocomplete"
          />
        </motion.div>
      </motion.div>
      {expandFilters && (
        <div className="filters__additional">
          <motion.div
            className="form-field filters__field"
            variants={itemVariants}
            transition={{ delay: 0.1 }}>
            <label htmlFor="maxPassengers">Maximum passengers allowed</label>
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
          <motion.div
            className="form-field filters__field"
            variants={itemVariants}
            transition={{ delay: 0.2 }}>
            <label htmlFor="rideType">Type of ride</label>
            <Field
              name="rideType"
              id="rideType"
              component={FormikSelect}
              options={[
                {
                  value: RIDE_TYPE.noPreference,
                  label: RIDE_TYPE_LABEL[RIDE_TYPE.noPreference],
                },
                {
                  value: RIDE_TYPE.regular,
                  label: RIDE_TYPE_LABEL[RIDE_TYPE.regular],
                },
                {
                  value: RIDE_TYPE.irregular,
                  label: RIDE_TYPE_LABEL[RIDE_TYPE.irregular],
                },
              ]}
            />
            <ErrorMessage
              name="rideType"
              component="span"
              className="input-message-error"
            />
          </motion.div>
          <motion.div
            className="form-field filters__field"
            variants={itemVariants}
            transition={{ delay: 0.3 }}>
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
        </div>
      )}
      <motion.div className="filters__more" variants={itemVariants}>
        <button
          type="button"
          className="filters__button"
          onClick={toggleFilters}>
          <IconFilters className="text-sm" />
          <span>{expandFilters ? 'Hide filters' : 'Show filters'}</span>
        </button>
        <button
          type="button"
          className="filters__button"
          onClick={handleClearForm}>
          <IconClearFilters className="text-sm" />
          <span>Reset search</span>
        </button>
      </motion.div>
    </>
  );
};

export default RideFilters;
