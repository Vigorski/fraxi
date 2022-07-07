// import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { MKD_CITIES } from '../../utilities/constants/cities';
import Layout from '../../components/shared/Layout';
import { updateUserPreferences } from '../../store/user/userActions'

const EditMyPreferences = () => {
	const { userDetails } = useSelector(state => state.user);
	console.log(userDetails)
  const dispatch = useDispatch();

	const handleValidation = values => {
		const errors = {};

		if (!values.numOfStops) {
			errors.numOfStops = 'Required';
		}

		return errors;
	};

	return (

		<Layout>
			<section className='profile profile--edit'>
				<Formik
					initialValues={{
						origin: 'Skopje',
						destination: 'Skopje',
            numOfStops: 1,
            routeType: 'regular',
            smoking: false
					}}
					validate={handleValidation}
					onSubmit={async (values, { setSubmitting }) => {
            await dispatch(updateUserPreferences(values));
						setSubmitting(false);
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							{/* {authError && (
								<div className='form-field'>
									<span className='input-message-error'>{globalFormError}</span>
								</div>
							)} */}
							<div className='form-field'>
								<label htmlFor='origin'>Your usual pick up location</label>
								<Field name='origin' id='origin' component='select'>
									{MKD_CITIES.map(city => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</Field>
								<ErrorMessage name='origin' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
                <label htmlFor='destination'>Your usual destination</label>
								<Field name='destination' id='destination' component='select'>
									{MKD_CITIES.map(city => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</Field>
								<ErrorMessage name='destination' component='span' className='input-message-error' />
							</div>
              <div className='form-field'>
                <label htmlFor='numOfStops'>Number of stops</label>
								<Field type='number' name='numOfStops' id='numOfStops' />
								<ErrorMessage name='numOfStops' component='span' className='input-message-error' />
							</div>
							<div className='form-field'>
                <label htmlFor='routeType'>Route</label>
								<Field name='routeType' id='routeType' component='select'>
                  <option value='regular'>Regular</option>
                  <option value='irregular'>Irregular</option>
								</Field>
								<ErrorMessage name='routeType' component='span' className='input-message-error' />
							</div>
              <div className='form-field'>
                <label htmlFor='smoking'>Smoking</label>
								<Field name='smoking' id='smoking' component='select'>
                  <option value={false}>No smoking</option>
                  <option value={true}>Smoking</option>
								</Field>
								<ErrorMessage name='smoking' component='span' className='input-message-error' />
							</div>

							<button className='btn-primary' type='submit' disabled={isSubmitting}>
								Save
							</button>
						</Form>
					)}
				</Formik>
			</section>
		</Layout>
	);
};

export default EditMyPreferences;
