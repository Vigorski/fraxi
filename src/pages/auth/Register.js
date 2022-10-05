import { Link } from 'react-router-dom';

import Layout from '../../components/shared/Layout';
import RegisterEditUser from '../user/RegisterEditUser';
import { LOGIN } from '../../utilities/constants/routes';

const Register = () => {
	return (
		<Layout>
			<h1>Create Your Account</h1>
			<RegisterEditUser />
			<div className="auth__or">
				<span>OR</span>
			</div>
			<Link className="btn-primary-ghost btn-block" to={LOGIN.path}>Sign in</Link>
		</Layout>
	);
};

export default Register;
