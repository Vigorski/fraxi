import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import FormFilters from 'components/forms/FormFilters';
import { getFilteredRides } from 'store/rides/ridesAsyncActions';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import RideResults from '../../components/rides/searchRides/RideResults';
import RideFilters from '../../components/rides/searchRides/RideFilters';

const SearchRides = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const { filteredRides } = useSelector(state => state.rides);
  const ridePreferences = userDetails?.ridePreferences;
  const isRidePreferencesValid =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  const handleObserverValues = useCallback(
    values => {
      dispatch(getFilteredRides({ searchPreferences: values }));
    },
    [dispatch],
  );

  const formInitialValues = {
    origin: isRidePreferencesValid ? ridePreferences.origin : '',
    destination: isRidePreferencesValid
      ? ridePreferences.destination
      : '',
    numOfStops: isRidePreferencesValid ? ridePreferences.numOfStops : 2,
    rideType: isRidePreferencesValid
      ? ridePreferences.rideType
      : 'regular',
    smoking: isRidePreferencesValid ? ridePreferences.smoking : false,
  }

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

        {filteredRides.length > 0 ? (
          <div className="card__wrapper">
            <RideResults filteredRides={filteredRides} />
          </div>
        ) : (
          <motion.h2 variants={itemVariants} className="h2-sm">
            No rides match your preferences
          </motion.h2>
        )}
      </motion.section>
    </Layout>
  );
};

export default SearchRides;
