import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import FormIkUserImage from '../forms/FormIkUserImage';
import { userUpdate, userRegister } from '../../store/user/userAsyncActions';
import { MY_PROFILE, LOGIN } from '../../utilities/constants/routes';

const RegisterEditUser = ({ editUserProfile }) => {
	const history = useHistory();
	const { userDetails } = useSelector(state => state.user);
	const dispatch = useDispatch();

	const handleValidation = values => {
		const errors = {};

		if (values.profilePicture !== undefined && values.profilePicture !== '') {
			const validFileType = values.profilePicture.type === 'image/jpeg' || values.profilePicture.type === 'image/png';

			if( !validFileType ) {
				errors.profilePicture = 'Not a supported image type';
			}
		}

		if (!values.name) {
			errors.name = 'Required';
		} else if (values.name.length < 3) {
			errors.name = 'Name must be at least 3 characters long';
		}

		if (!values.surname) {
			errors.surname = 'Required';
		} else if (values.surname.length < 6) {
			errors.surname = 'Surname must be at least 6 characters long';
		}

		if (!editUserProfile) {
			if (!values.email) {
				errors.email = 'Required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Invalid email address';
			}
		}

		if (!values.password && !editUserProfile) {
			errors.password = ['Required'];
		} else if (values.password.length > 0) {
			// errors.password = [];
			// if (!/^(?=.*[A-Z])/.test(values.password)) errors.password.push('one uppercase letter');
			// if (!/^(?=.*[a-z])/.test(values.password)) errors.password.push('one lowercase letter');
			// if (!/^(?=.*\d)/i.test(values.password)) errors.password.push('one digit');
			// if (!/^(?=.*(\W|_))/i.test(values.password)) errors.password.push('one symbol');
			// if (!/.{5,}$/i.test(values.password)) errors.password.push('at least 4 characters long');
		}
		if (!values.confirmPassword && !editUserProfile) {
			errors.confirmPassword = 'Required';
		} else if (values.password !== values.confirmPassword) {
			errors.confirmPassword = 'Passwords must match';
		}

		if (!values.userType && !editUserProfile) {
			errors.userType = 'Required';
		}

		return errors;
	};

	return (
		<Formik
			initialValues={{
				profilePicture: '',
				name: !!userDetails ? userDetails.name : '',
				surname: !!userDetails ? userDetails.surname : '',
				email: '',
				password: '',
				confirmPassword: '',
				phone: !!userDetails ? userDetails.phone : '',
				userType: null,
			}}
			enableReinitialize={true}
			validate={handleValidation}
			onSubmit={async (values, { setSubmitting }) => {
				if (editUserProfile) {
					await dispatch(userUpdate({ userId: userDetails.userId, values })).unwrap();
					setSubmitting(false);
					history.push(MY_PROFILE.path);
				} else {
					await dispatch(userRegister({ values })).unwrap();
					setSubmitting(false);
					history.push(LOGIN.path);
				}
			}}
		>
			{({ isSubmitting }) => (
				<Form>
					<div className='form-field'>
						<Field name='profilePicture' id='profilePicture' component={FormIkUserImage} profilePicture={userDetails?.profilePicture} />
						<ErrorMessage name='profilePicture' component='span' className='input-message-error' />
					</div>
					<div className='form-field'>
						<Field type='text' name='name' placeholder='Name' />
						<ErrorMessage name='name' component='span' className='input-message-error' />
					</div>
					<div className='form-field'>
						<Field type='text' name='surname' placeholder='Last name' />
						<ErrorMessage name='surname' component='span' className='input-message-error' />
					</div>
					{!editUserProfile && (
						<div className='form-field'>
							<Field type='email' name='email' placeholder='Email' />
							<ErrorMessage name='email' component='span' className='input-message-error' />
						</div>
					)}
					<div className='form-field'>
						<Field type='password' name='password' placeholder='Password' />
						<ErrorMessage name='password'>
							{msg => (
								<ul className='list'>
									{msg.map((msgItem, index) => (
										<li key={index + msgItem}>{msgItem}</li>
									))}
								</ul>
							)}
						</ErrorMessage>
					</div>
					<div className='form-field'>
						<Field type='password' name='confirmPassword' placeholder='Confirm password' />
						<ErrorMessage name='confirmPassword' component='span' className='input-message-error' />
					</div>
					<div className='form-field'>
						<Field type='tel' name='phone' placeholder='Phone' />
						<ErrorMessage name='phone' component='span' className='input-message-error' />
					</div>
					{!editUserProfile && (
						<div className='form-field'>
							<h4>What do you want to register as?</h4>
							<div className='input-radio'>
								<Field id='userPassenger' type='radio' name='userType' value='passenger' />
								<label htmlFor='userPassenger'>Passenger</label>
							</div>
							<div className='input-radio'>
								<Field id='userDriver' type='radio' name='userType' value='driver' />
								<label htmlFor='userDriver'>Driver</label>
							</div>
							<ErrorMessage name='userType' component='span' className='input-message-error' />
						</div>
					)}
					<button className='btn-primary' type='submit' disabled={isSubmitting}>
						{editUserProfile ? 'Update' : 'Register'}
					</button>
				</Form>
			)}
		</Formik>
	);
};

export default RegisterEditUser;
