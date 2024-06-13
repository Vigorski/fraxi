import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import RideResults from 'components/rides/searchRides/RideResults';
import RideFilters from 'components/rides/searchRides/RideFilters';
import FormFilters from 'components/forms/FormFilters';
import GoogleMapsLoader from 'components/shared/GoogleMapsLoader';
import { getFilteredRides } from 'store/rides/ridesAsyncActions';
import { mainContainerVariants } from 'utilities/constants/framerVariants';
import { MAX_PASSENGERS, RIDE_TYPE, SMOKING } from 'types/rides';

const SearchRides = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const [filteredRides, setFilteredRides] = useState([]);
  const ridePreferences = userDetails?.ridePreferences;
  const ridePreferencesExist =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  const handleObserverValues = useCallback(
    async values => {
      const filteredRidesResponse = await dispatch(
        getFilteredRides({ searchPreferences: values }),
      ).unwrap();
      setFilteredRides(filteredRidesResponse);
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
    <GoogleMapsLoader>
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
    </GoogleMapsLoader>
  );
};

export default SearchRides;
