import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import Layout from '../../../components/shared/Layout';
import ActiveRidesCard from './ActiveRidesCard';
import { mainContainerVariants, itemVariants } from '../../../utilities/constants/framerVariants';

const ActiveRides = () => {
	const { activeRides } = useSelector(state => state.rides);

	return (
		<Layout>
			<motion.section
				className='active-rides'
				variants={mainContainerVariants}
				initial="initial"
    		animate="visible"
				exit="hidden"
			>
				<div className='card__wrapper'>
					{activeRides.length > 0 ? <ActiveRidesCard activeRides={activeRides} /> : <motion.h4 variants={itemVariants}>You have no active rides at the moment</motion.h4>}
				</div>
			</motion.section>
		</Layout>
	);
};

export default ActiveRides;
