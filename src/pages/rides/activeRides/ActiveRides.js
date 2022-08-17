import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Layout from '../../../components/shared/Layout';
import ActiveRidesCard from './ActiveRidesCard';
import { getUserActiveRides } from '../../../store/rides/ridesActions';

const ActiveRides = () => {
	const dispatch = useDispatch();
	const { userDetails } = useSelector(state => state.user);
	const { activeRides } = useSelector(state => state.rides);

	useEffect(() => {
		if (userDetails) {
			dispatch(getUserActiveRides(userDetails.activeRides));
		}
	}, [dispatch, userDetails]);

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
