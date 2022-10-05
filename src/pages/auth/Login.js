import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { userLogin } from '../../store/user/userAsyncActions'
import Layout from '../../components/shared/Layout';
import { MY_PROFILE, REGISTER } from '../../utilities/constants/routes';

const Login = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { userDetails } = useSelector(state => state.user);
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
					await dispatch(userLogin({values}))
						.then(res => {
							setSubmitting(false);
							history.push(MY_PROFILE.path);
						});
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
						<button className='btn-primary btn-block' type='submit' disabled={isSubmitting}>
							Sign in
						</button>
					</Form>
				)}
			</Formik>
			<div className="auth__or">
				<span>OR</span>
			</div>
			<Link className="btn-primary-ghost btn-block" to={REGISTER.path}>Register</Link>
		</Layout>
	);
};

export default Login;
