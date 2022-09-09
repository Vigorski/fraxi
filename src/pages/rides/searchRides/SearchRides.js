import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Layout from '../../../components/shared/Layout';
import FormFilters from '../../../components/forms/FormFilters';
import RideResults from './RideResults';
import RideFilters from './RideFilters';

import { getFilteredRides } from '../../../store/rides/ridesAsyncActions';

const SearchRides = () => {
	const dispatch = useDispatch();
	const { userDetails } = useSelector(state => state.user);
	const { filteredRides } = useSelector(state => state.rides);
	const ridePreferences = userDetails?.ridePreferences;
	const isRidePreferencesValid = ridePreferences && Object.keys(ridePreferences).length !== 0;

	const handleObserverValues = useCallback(async values => {
		await dispatch(getFilteredRides({ searchPreferences: values })).unwrap();
	}, [dispatch]);

	return (
		<Layout>
			<section className='search-rides'>
				<FormFilters
					initialValues={{
						origin: isRidePreferencesValid ? ridePreferences.origin : '',
						destination: isRidePreferencesValid ? ridePreferences.destination : '',
						numOfStops: isRidePreferencesValid ? ridePreferences.numOfStops : 2,
						rideType: isRidePreferencesValid ? ridePreferences.rideType : "regular",
						smoking: isRidePreferencesValid ? ridePreferences.smoking : false
					}}
					handleObserverValues={handleObserverValues}
				>
					<RideFilters />
				</FormFilters>
				
				{filteredRides.length > 0 ?
					<RideResults filteredRides={filteredRides} /> :
					<h2>No rides match your preferences</h2>
				}
			</section>
		</Layout>
	);
};

export default SearchRides;
