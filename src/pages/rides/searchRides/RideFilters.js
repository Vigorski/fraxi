import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';

import FormIKSelect from '../../../components/forms/FormIKSelect';
import { MKD_CITIES_ABBREVIATED } from '../../../utilities/constants/cities';
import { itemVariants } from '../../../utilities/constants/framerVariants';

const citiesOptions = Object.entries(MKD_CITIES_ABBREVIATED).map(([cityKey, cityVal]) => {
  return { value: cityVal, label: cityKey };
});

const RideFilters = () => {
  const [expandFilters, setExpandFilters] = useState(false);
  const toggleFilters = (e) => {
    e.preventDefault();
    setExpandFilters(!expandFilters);
  }

  return (
    <>
      <motion.div className="filters__route" variants={itemVariants}>
        <motion.div className='form-field' initial={{x: '100%'}} animate={{x: 0}} transition={{delay: 0.3}}>
          <label htmlFor='origin'>origin</label>
          <Field name='origin' id='origin' component={FormIKSelect} options={citiesOptions} />
          <ErrorMessage name='origin' component='span' className='input-message-error' />
        </motion.div>
        <div className="filters__dash" />
        <motion.div className='form-field' initial={{x: '-100%'}} animate={{x: 0}} transition={{delay: 0.3}}>
          <label htmlFor='destination'>destination</label>
          <Field name='destination' id='destination' component={FormIKSelect} options={citiesOptions} />
          <ErrorMessage name='destination' component='span' className='input-message-error' />
        </motion.div>
      </motion.div>
      {expandFilters && 
        <div className="filters__additional">
          <motion.div className='form-field' variants={itemVariants} transition={{delay: 0.1}}>
            <label htmlFor='smoking'>Number of stops</label>
            <Field type='number' name='numOfStops' placeholder='numOfStops' />
            <ErrorMessage name='numOfStops' component='span' className='input-message-error' />
          </motion.div>
          <motion.div className='form-field' variants={itemVariants} transition={{delay: 0.2}}>
            <label htmlFor='rideType'>Type of ride</label>
            <Field name='rideType' id='rideType' component={FormIKSelect} options={[{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }]} />
            <ErrorMessage name='rideType' component='span' className='input-message-error' />
          </motion.div>
          <motion.div className='form-field' variants={itemVariants} transition={{delay: 0.3}}>
            <label htmlFor='smoking'>Smoking</label>
            <Field name='smoking' id='smoking' component={FormIKSelect} options={[{ value: false, label: 'No smoking' }, { value: true, label: 'Smoking' }]} />
            <ErrorMessage name='smoking' component='span' className='input-message-error' />
          </motion.div>
        </div>
      }
      <motion.div className="filters__more" variants={itemVariants}>
        <button className="btn-link" onClick={toggleFilters}>{expandFilters ? 'Show less' : 'Show more'}</button>
      </motion.div>
    </>
  );
}

export default RideFilters;