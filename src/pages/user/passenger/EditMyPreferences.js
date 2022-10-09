import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';

import FormIKSelect from '../../../components/forms/FormIKSelect';
import { MKD_CITIES } from '../../../utilities/constants/cities';
import Layout from '../../../components/shared/Layout';
import { updateRidePreferences } from '../../../store/user/userAsyncActions';
import { MY_PROFILE } from '../../../utilities/constants/routes';
import { mainContainerVariants, itemVariants } from '../../../utilities/constants/framerVariants';

const EditMyPreferences = () => {
	const history = useHistory();
	const { userDetails } = useSelector(state => state.user);
	const ridePreferences = userDetails?.ridePreferences;
  const dispatch = useDispatch();
	
	const handleValidation = values => {
		const errors = {};

		if (!values.numOfStops) {
			errors.numOfStops = 'Required';
		} else if (values.numOfStops <= 0) {
			errors.numOfStops = 'Must be positive integer';
		}

		return errors;
	};

	const citiesOptions = MKD_CITIES.map(city => {
		return { value: city, label: city };
	});

	const isRidePreferencesValid = ridePreferences && Object.keys(ridePreferences).length !== 0;
	
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
						origin: isRidePreferencesValid ? ridePreferences.origin : 'Skopje',
						destination: isRidePreferencesValid ? ridePreferences.destination : 'Skopje',
            numOfStops: isRidePreferencesValid ? ridePreferences.numOfStops : 1,
            rideType: isRidePreferencesValid ? ridePreferences.rideType : 'regular',
            smoking: isRidePreferencesValid ? ridePreferences.smoking : false
					}}
					validate={handleValidation}
					onSubmit={async (values, { setSubmitting }) => {
						await dispatch(updateRidePreferences({userId: userDetails.userId, values}))
							.then(res => {
								history.push(MY_PROFILE.path);
								setSubmitting(false);
							});
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<motion.div className='form-field' variants={itemVariants}>
								<label htmlFor='origin'>Your usual pick up location</label>
								<Field name='origin' id='origin' component={FormIKSelect} options={citiesOptions} />
								<ErrorMessage name='origin' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
                <label htmlFor='destination'>Your usual destination</label>
								<Field name='destination' id='destination' component={FormIKSelect} options={citiesOptions} />
								<ErrorMessage name='destination' component='span' className='input-message-error' />
							</motion.div>
              <motion.div className='form-field' variants={itemVariants}>
                <label htmlFor='numOfStops'>Number of stops</label>
								<Field type='number' name='numOfStops' id='numOfStops' />
								<ErrorMessage name='numOfStops' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
                <label htmlFor='rideType'>Type of ride</label>
								<Field name='rideType' id='rideType' component={FormIKSelect} options={[{ value: 'regular', label: 'Regular' }, { value: 'irregular', label: 'Irregular' }]} />
								<ErrorMessage name='rideType' component='span' className='input-message-error' />
							</motion.div>
              <motion.div className='form-field' variants={itemVariants}>
                <label htmlFor='smoking'>Smoking</label>
								<Field name='smoking' id='smoking' component={FormIKSelect} options={[{ value: false, label: 'No smoking' }, { value: true, label: 'Smoking' }]} />
								<ErrorMessage name='smoking' component='span' className='input-message-error' />
							</motion.div>

							<motion.button className='btn-primary btn-block mt-xl' type='submit' disabled={isSubmitting} variants={itemVariants}>
								Save
							</motion.button>
						</Form>
					)}
				</Formik>
			</motion.section>
		</Layout>
	);
};

export default EditMyPreferences;
