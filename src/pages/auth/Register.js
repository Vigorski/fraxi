import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Layout from '../../components/shared/Layout';
import RegisterEditUser from '../user/RegisterEditUser';
import { LOGIN } from '../../utilities/constants/routes';
import { mainContainerVariants, itemVariants } from '../../utilities/constants/framerVariants';

const Register = () => {
	return (
		<Layout>
			<motion.div 
				variants={mainContainerVariants}
				initial="initial"
    		animate="visible"
				exit="hidden"
			>
				<motion.h1 className="h1-sm mb-xxl" variants={itemVariants}>Create Your Account</motion.h1>
				<RegisterEditUser />
				<motion.div className="auth__or" variants={itemVariants}>
					<span>OR</span>
				</motion.div>
				<motion.div variants={itemVariants}>
					<Link className="btn-primary-ghost btn-block" to={LOGIN.path}>Sign in</Link>
				</motion.div>
			</motion.div>
		</Layout>
	);
};

export default Register;
