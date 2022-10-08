import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import Layout from '../../components/shared/Layout';
import RegisterEditUser from '../user/RegisterEditUser';
import { LOGIN } from '../../utilities/constants/routes';
import { containerAnimate, itemAnimate } from '../../utilities/constants/framerVariants';

const Register = () => {
	return (
		<Layout>
			<motion.div 
				variants={containerAnimate}
				initial="hidden"
				animate="visible"
				key="main-variant"
				// initial={{scale: 0}}
				// animate={{scale: 1}}
				// exit={{scale: 0}}
			>
				<motion.h1 className="h1-sm mb-xxl" variants={itemAnimate}>Create Your Account</motion.h1>
				<RegisterEditUser />
				<motion.div className="auth__or" variants={itemAnimate}>
					<span>OR</span>
				</motion.div>
				<motion.div variants={itemAnimate}>
					<Link className="btn-primary-ghost btn-block" to={LOGIN.path}>Sign in</Link>
				</motion.div>
			</motion.div>
		</Layout>
	);
};

export default Register;
