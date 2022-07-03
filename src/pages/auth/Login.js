import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { authActions } from '../../store/auth/AuthSlice';

import useHttp from '../../hooks/useHttp';
import { makeRequest } from '../../utilities/api';
import { FIREBASE_DB } from '../../utilities/constants/db';
import Layout from '../../components/shared/Layout';

import { ROUTE_RESULTS } from '../../utilities/constants/routes';

const getUsersDetails = () => {
	return { url: `${FIREBASE_DB}/users.json` };
};

const Login = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [globalError, setGlobalError] = useState(null);
	const { handleRequest: getUsers } = useHttp(false, true);

	const validateUser = (allUsers, values) => {
		setGlobalError(null);

		const found = Object.values(allUsers).find(item => item.email === values.email && item.password === values.password);
		if (found === undefined) {
			setGlobalError('Email or password does not match!');
		}
		return found;
	};

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
					const allUsers = await getUsers(getUsersDetails(), makeRequest);
					const loggedUser = validateUser(allUsers, values);

					if (loggedUser !== undefined) {
						dispatch(authActions.addLoggedInUser({user: loggedUser}))
						history.push(ROUTE_RESULTS);
					}

					setSubmitting(false);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						{globalError && (
							<div className='form-field'>
								<span className='input-message-error'>{globalError}</span>
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
