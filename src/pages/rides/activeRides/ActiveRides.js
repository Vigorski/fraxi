import { useSelector } from 'react-redux';

import Layout from '../../../components/shared/Layout';
import ActiveRidesCard from './ActiveRidesCard';

const ActiveRides = () => {
	const { activeRides } = useSelector(state => state.rides);

	return (
		<Layout>
			<section className='active-rides'>
				<div className='card__wrapper'>
					{activeRides.length > 0 ? <ActiveRidesCard activeRides={activeRides} /> : <h4>You have no active rides at the moment</h4>}
				</div>
			</section>
		</Layout>
	);
};

export default ActiveRides;
