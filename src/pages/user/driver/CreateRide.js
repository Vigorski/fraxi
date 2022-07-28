import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import FormIKSelect from '../../../components/forms/FormIKSelect';
import { MKD_CITIES } from '../../../utilities/constants/cities';
import Layout from '../../../components/shared/Layout';
import { addNewRide } from '../../../store/rides/ridesActions';
import { addTime } from '../../../utilities/date-time';

const CreateRide = () => {
	const minDepartureDate = new Date(addTime([1]));
	const [departureDate, setDepartureDate] = useState(minDepartureDate);
	const history = useHistory();
	const { userDetails } = useSelector(state => state.user);
	const dispatch = useDispatch();

	const handleValidation = values => {
		const errors = {};

		if (!values.price) {
			errors.price = 'Required';
		} else if (values.price <= 0) {
			errors.price = 'Must be positive integer';
		}
		if (!values.maxPassengers) {
			errors.maxPassengers = 'Required';
		} else if (values.maxPassengers <= 0) {
			errors.maxPassengers = 'Must be positive integer';
		}

		return errors;
	};

	const citiesOptions = MKD_CITIES.map(city => {
		return { value: city, label: city };
	});

	return (
		<Layout>
			<section className='profile profile--edit'>
				<Formik
					initialValues={{
						origin: 'Skopje',
						destination: 'Skopje',
						price: 0,
						maxPassengers: 4,
						departureDate: minDepartureDate,
						routeType: 'regular',
						smoking: false,
					}}
					validate={handleValidation}
					onSubmit={async (values, { setSubmitting }) => {
						await dispatch(addNewRide(userDetails.userId, values, history));
						setSubmitting(false);
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<div className='form-field'>
								<label htmlFor='origin'>Origin</label>
								<Field name='origin' id='origin' component={FormIKSelect} options={citiesOptions} />
								<ErrorMessage name='origin' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
								<label htmlFor='destination'>Destination</label>
								<Field name='destination' id='destination' component={FormIKSelect} options={citiesOptions} />
								<ErrorMessage name='destination' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
								<label htmlFor='departureDate'>Departure date</label>
								<DatePicker
									name='departureDate'
									id='departureDate'
									selected={departureDate}
									onChange={(date) => setDepartureDate(date)}
									showTimeSelect
									dateFormat="d MMMM, yyyy h:mm aa"
									timeFormat='HH:mm'
									timeIntervals={15}
								/>
								<ErrorMessage name='departureDate' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
								<label htmlFor='price'>Price per person</label>
								<Field name='price' id='price' type='number' />
								<ErrorMessage name='price' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
								<label htmlFor='maxPassengers'>Maximum number of passengers</label>
								<Field name='maxPassengers' id='maxPassengers' type='number' />
								<ErrorMessage name='maxPassengers' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
								<label htmlFor='routeType'>Route</label>
								<Field
									name='routeType'
									id='routeType'
									component={FormIKSelect}
									options={[
										{ value: 'regular', label: 'Regular' },
										{ value: 'irregular', label: 'Irregular' },
									]}
								/>
								<ErrorMessage name='routeType' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
								<label htmlFor='smoking'>Smoking</label>
								<Field
									name='smoking'
									id='smoking'
									component={FormIKSelect}
									options={[
										{ value: false, label: 'No smoking' },
										{ value: true, label: 'Smoking' },
									]}
								/>
								<ErrorMessage name='smoking' component='span' className='input-message-error' />
							</div>

							<button className='btn-primary btn-block mt-xl' type='submit' disabled={isSubmitting}>
								Create ride
							</button>
						</Form>
					)}
				</Formik>
			</section>
		</Layout>
	);
};

export default CreateRide;
