import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import FormObserver from '../../components/forms/FormObserver';
import FormIKSelect from '../../components/forms/FormIKSelect';
import { MKD_CITIES } from '../../utilities/constants/cities'; //MKD_CITIES_ABBREVIATED
import Layout from '../../components/shared/Layout';
import RideResults from './RideResults';

import { getFilteredRides } from '../../store/rides/ridesActions';

const citiesOptions = MKD_CITIES.map(city => {
	return { value: city, label: city };
});

const SearchRides = () => {
	const dispatch = useDispatch();
	const { userDetails } = useSelector(state => state.user);
	const { filteredRides } = useSelector(state => state.rides);
	const ridePreferences = userDetails?.ridePreferences;

	useEffect(() => {
		if (userDetails) {
			dispatch(getFilteredRides(ridePreferences));
		}
	}, [dispatch, userDetails, ridePreferences]);

	const isRidePreferencesValid = ridePreferences && Object.keys(ridePreferences).length !== 0;

	return (
		<Layout>
			<section className='search-rides'>
				<div className="filters">
					<Formik
						initialValues={{
							origin: isRidePreferencesValid ? ridePreferences.origin : '',
							destination: isRidePreferencesValid ? ridePreferences.destination : ''
						}}
						onChange={(values) => {
							console.log(values)
						}}
					>
						{() => (
							<Form>
								<FormObserver />
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
								{/* <div className='form-field'>
									<Field type='email' name='email' placeholder='Email' />
									<ErrorMessage name='email' component='span' className='input-message-error' />
								</div> */}
							</Form>
						)}
					</Formik>
				</div>

				<RideResults filteredRides={filteredRides} />
			</section>
		</Layout>
	);
};

export default SearchRides;
