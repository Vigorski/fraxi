import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';

import { userLogin } from '../../store/user/userAsyncActions'
import Layout from '../../components/shared/Layout';
import { MY_PROFILE, REGISTER } from '../../utilities/constants/routes';
import { mainContainerVariants, itemVariants } from '../../utilities/constants/framerVariants';

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
			<motion.div
				variants={mainContainerVariants}
				initial="initial"
    		animate="visible"
				exit="hidden"
			>
				<motion.h1 className="h1-sm mb-xxl" variants={itemVariants}>Login</motion.h1>
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
							<motion.div className='form-field' variants={itemVariants}>
								<Field type='email' name='email' placeholder='Email' />
								<ErrorMessage name='email' component='span' className='input-message-error' />
							</motion.div>
							<motion.div className='form-field' variants={itemVariants}>
								<Field type='password' name='password' placeholder='Password' />
								<ErrorMessage name='password' component='span' className='input-message-error' />
							</motion.div>
							<motion.button className='btn-primary btn-block' type='submit' disabled={isSubmitting} variants={itemVariants}>
								Sign in
							</motion.button>
						</Form>
					)}
				</Formik>
				<motion.div className="auth__or" variants={itemVariants}>
					<span>OR</span>
				</motion.div>
				<motion.div variants={itemVariants}>
					<Link className="btn-primary-ghost btn-block" to={REGISTER.path}>Register</Link>
				</motion.div>
			</motion.div>
		</Layout>
	);
};

export default Login;
