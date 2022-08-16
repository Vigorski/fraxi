import { useState } from 'react';
import { Field, ErrorMessage } from 'formik';

import FormIKSelect from '../../../components/forms/FormIKSelect';
import { MKD_CITIES_ABBREVIATED } from '../../../utilities/constants/cities';

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
      <div className="filters__route">
        <div className='form-field'>
          <label htmlFor='origin'>origin</label>
          <Field name='origin' id='origin' component={FormIKSelect} options={citiesOptions} />
          <ErrorMessage name='origin' component='span' className='input-message-error' />
        </div>
        <div className="filters__dash" />
        <div className='form-field'>
          <label htmlFor='destination'>destination</label>
          <Field name='destination' id='destination' component={FormIKSelect} options={citiesOptions} />
          <ErrorMessage name='destination' component='span' className='input-message-error' />
        </div>
      </div>
      {expandFilters && 
        <div className="filters__additional">
          <div className='form-field'>
            <label htmlFor='smoking'>Number of stops</label>
            <Field type='number' name='numOfStops' placeholder='numOfStops' />
            <ErrorMessage name='numOfStops' component='span' className='input-message-error' />
          </div>
          <div className='form-field'>
            <label htmlFor='rideType'>Type of ride</label>
            <Field name='rideType' id='rideType' component={FormIKSelect} options={[{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }]} />
            <ErrorMessage name='rideType' component='span' className='input-message-error' />
          </div>
          <div className='form-field'>
            <label htmlFor='smoking'>Smoking</label>
            <Field name='smoking' id='smoking' component={FormIKSelect} options={[{ value: false, label: 'No smoking' }, { value: true, label: 'Smoking' }]} />
            <ErrorMessage name='smoking' component='span' className='input-message-error' />
          </div>
        </div>
      }
      <div className="filters__more">
        <button className="btn-link" onClick={toggleFilters}>{expandFilters ? 'Show less' : 'Show more'}</button>
      </div>
    </>
  );
}

export default RideFilters;