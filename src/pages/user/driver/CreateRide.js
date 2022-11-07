import { useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { motion } from 'framer-motion';

import FormIKSelect from '../../../components/forms/FormIKSelect';
import Layout from '../../../components/shared/Layout';
import { addNewRide } from '../../../store/rides/ridesAsyncActions';
import { addTime } from '../../../utilities/date-time';
// import { MKD_CITIES } from '../../../utilities/constants/cities';
import { MY_PROFILE } from '../../../utilities/constants/routes';
import { mainContainerVariants, itemVariants } from '../../../utilities/constants/framerVariants';
import Map from '../../../components/shared/Map';
import { mapsKey } from '../../../utilities/constants/map';

const CreateRide = () => {
	const minDepartureDate = new Date(addTime([1]));
	const [departureDate, setDepartureDate] = useState(minDepartureDate);
	const history = useHistory();
	const { userDetails } = useSelector(state => state.user);
	const dispatch = useDispatch();
	const routeMapDetails = useRef({})

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

	// const citiesOptions = MKD_CITIES.map(city => {
	// 	return { value: city, label: city };
	// });

	const mapRender = (status) => {
		if (status === Status.FAILURE) return <p>Error loading maps</p>;
  	
		return <p>Loading...</p>;
	};

	const handleRouteMapDetails = useCallback((route) => {
		routeMapDetails.current = route;
	}, []);

	return (
		<Layout>
			<motion.section
				className='profile profile--edit'
				variants={mainContainerVariants}
				initial="initial"
    		animate="visible"
				exit="hidden"
			>
				<Formik
					initialValues={{
						// origin: 'Skopje',
						// destination: 'Skopje',
						price: 0,
						maxPassengers: 4,
						departureDate: minDepartureDate,
						rideType: 'regular',
						smoking: false,
					}}
					validate={handleValidation}
					onSubmit={async (values, { setSubmitting }) => {
						await dispatch(addNewRide({ driver: userDetails, route: routeMapDetails.current, values })).unwrap();
						setSubmitting(false);
						history.push(MY_PROFILE.path);
					}}
				>
					{({ isSubmitting, values }) => (
						<Form>
							{/* <motion.div className='form-field' variants={itemVariants}>
								<label htmlFor='origin'>Origin</label>
								<Field name='origin' id='origin' component={FormIKSelect} options={citiesOptions} />
								<ErrorMessage name='origin' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
								<label htmlFor='destination'>Destination</label>
								<Field name='destination' id='destination' component={FormIKSelect} options={citiesOptions} />
								<ErrorMessage name='destination' component='span' className='input-message-error' />
							</motion.div> */}
							<motion.div className='form-field' variants={itemVariants}>
								<Wrapper apiKey={mapsKey} render={mapRender}>
									<Map 
										center={{lat: -34.397, lng: 150.644}}
										zoom={20}
										originCity={'Skopje'}
										destinationCity={'Prilep'}
										handleRouteMapDetails={handleRouteMapDetails}
									/>
								</Wrapper>
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
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
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
								<label htmlFor='price'>Price per person</label>
								<Field name='price' id='price' type='number' />
								<ErrorMessage name='price' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
								<label htmlFor='maxPassengers'>Maximum number of passengers</label>
								<Field name='maxPassengers' id='maxPassengers' type='number' />
								<ErrorMessage name='maxPassengers' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
								<label htmlFor='rideType'>Ride</label>
								<Field
									name='rideType'
									id='rideType'
									component={FormIKSelect}
									options={[
										{ value: 'regular', label: 'Regular' },
										{ value: 'irregular', label: 'Irregular' },
									]}
								/>
								<ErrorMessage name='rideType' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
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
							</motion.div>
							<motion.button className='btn-primary btn-block mt-xl' type='submit' disabled={isSubmitting} variants={itemVariants}>
								Create ride
							</motion.button>
						</Form>
					)}
				</Formik>
			</motion.section>
		</Layout>
	);
};

export default CreateRide;
