import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { MY_PROFILE } from '../../utilities/constants/routes';
import { userLogin } from '../../store/user/userActions'
import Layout from '../../components/shared/Layout';


const Login = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	// const { httpState } = useSelector(state => state.http);
	const { userDetails, isLoggedIn } = useSelector(state => state.user);
	const { globalFormError } = useSelector(state => state.errors);

	const handleValidation = values => {
		const errors = {};

		if (!values.email) {
			errors.email = 'Required';
		}

		if (!values.password) {
			errors.password = 'Required';
		}

		return errors;
	};

	const authError = userDetails === null && globalFormError.trim().length !== 0;
	
	useEffect(() => {
		if(isLoggedIn) {
			history.push(MY_PROFILE);
		}
	}, [isLoggedIn, history]);

	return (
		<Layout>
			<h1>Login</h1>

			<Formik
				initialValues={{
					email: '',
					password: '',
				}}
				validate={handleValidation}
				onSubmit={async (values, { setSubmitting }) => {
					await dispatch(userLogin(values));
					setSubmitting(false);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						{authError && (
							<div className='form-field'>
								<span className='input-message-error'>{globalFormError}</span>
							</div>
						)}
						<div className='form-field'>
							<Field type='email' name='email' placeholder='Email' />
							<ErrorMessage name='email' component='span' className='input-message-error' />
						</div>
						<div className='form-field'>
							<Field type='password' name='password' placeholder='Password' />
							<ErrorMessage name='password' component='span' className='input-message-error' />
						</div>
						<button className='btn-primary' type='submit' disabled={isSubmitting}>
							Sign in
						</button>
					</Form>
				)}
			</Formik>
		</Layout>
	);
};

export default Login;
