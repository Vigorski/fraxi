import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import RideResults from 'components/rides/searchRides/RideResults';
import RideFilters from 'components/rides/searchRides/RideFilters';
import FormFilters from 'components/forms/FormFilters';
import { getFilteredRides } from 'store/rides/ridesAsyncActions';
import { mainContainerVariants } from 'utilities/constants/framerVariants';
import { MAX_PASSENGERS, RIDE_TYPE, SMOKING } from 'utilities/constants/rides';

const SearchRides = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const { filteredRides } = useSelector(state => state.rides);
  const ridePreferences = userDetails?.ridePreferences;
  const ridePreferencesExist =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  const handleObserverValues = useCallback(
    values => {
      dispatch(getFilteredRides({ searchPreferences: values }));
    },
    [dispatch],
  );

  const formInitialValues = {
    origin: ridePreferencesExist ? ridePreferences.origin : '',
    destination: ridePreferencesExist ? ridePreferences.destination : '',
    maxPassengers: ridePreferencesExist
      ? ridePreferences.maxPassengers
      : MAX_PASSENGERS.noPreference,
    rideType: ridePreferencesExist
      ? ridePreferences.rideType
      : RIDE_TYPE.noPreference,
    smoking: ridePreferencesExist
      ? ridePreferences.smoking
      : SMOKING.noPreference,
  };

  return (
    <Layout>
      <motion.section
        className="search-rides"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <FormFilters
          initialValues={formInitialValues}
          handleObserverValues={handleObserverValues}>
          <RideFilters />
        </FormFilters>

        <RideResults filteredRides={filteredRides} />
      </motion.section>
    </Layout>
  );
};

export default SearchRides;
