import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import FormIKSelect from 'components/forms/FormIKSelect';
import { MKD_CITIES_ABBREVIATED } from 'utilities/constants/cities';
import { itemVariants } from 'utilities/constants/framerVariants';
import {
  MAX_PASSENGERS,
  MAX_PASSENGERS_LABEL,
  RIDE_TYPE,
  RIDE_TYPE_LABEL,
  SMOKING,
  SMOKING_LABEL,
} from 'utilities/constants/rides';

const citiesOptions = Object.entries(MKD_CITIES_ABBREVIATED).map(
  ([cityKey, cityVal]) => {
    return { label: cityVal, value: cityKey };
  },
);

const RideFilters = () => {
  const [expandFilters, setExpandFilters] = useState(false);
  const toggleFilters = e => {
    e.preventDefault();
    setExpandFilters(!expandFilters);
  };

  return (
    <>
      <motion.div className="filters__route" variants={itemVariants}>
        <motion.div
          className="form-field"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}>
          <label htmlFor="origin">origin</label>
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
        <div className="filters__dash" />
        <motion.div
          className="form-field"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}>
          <label htmlFor="destination">destination</label>
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
      </motion.div>
      {expandFilters && (
        <div className="filters__additional">
          <motion.div
            className="form-field"
            variants={itemVariants}
            transition={{ delay: 0.1 }}>
            <label htmlFor="maxPassengers">Maximum passengers allowed</label>
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
          <motion.div
            className="form-field"
            variants={itemVariants}
            transition={{ delay: 0.2 }}>
            <label htmlFor="rideType">Type of ride</label>
            <Field
              name="rideType"
              id="rideType"
              component={FormIKSelect}
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
            className="form-field"
            variants={itemVariants}
            transition={{ delay: 0.3 }}>
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
        </div>
      )}
      <motion.div className="filters__more" variants={itemVariants}>
        <button className="btn-link" onClick={toggleFilters}>
          {expandFilters ? 'Show less' : 'Show more'}
        </button>
      </motion.div>
    </>
  );
};

export default RideFilters;
