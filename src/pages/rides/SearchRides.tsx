import { useCallback, useState } from 'react';
import RideResults from 'components/rides/searchRides/RideResults';
import RideFilters from 'components/rides/searchRides/RideFilters';
import FormFilters from 'components/forms/FormFilters';
import { getFilteredRides } from 'store/rides/ridesAsyncActions';
import {
  MAX_PASSENGERS,
  RIDE_TYPE,
  RidePreferences,
  RideWithDriver,
  SearchRideFormValues,
  SMOKING,
} from 'types/ride';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import MotionWrapper from 'layout/MotionWrapper';

const SearchRides = () => {
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(state => state.user);
  const [filteredRides, setFilteredRides] = useState<RideWithDriver[] | null>();
  const ridePreferences = userDetails?.ridePreferences;
  const ridePreferencesExist =
    ridePreferences && Object.keys(ridePreferences).length !== 0;

  const handleObserverValues = useCallback(
    async (values: SearchRideFormValues): Promise<void> => {
      const filteredRidesResponse = await dispatch(
        getFilteredRides({ searchPreferences: values }),
      ).unwrap();
      setFilteredRides(filteredRidesResponse);
    },
    [dispatch],
  );

  const formInitialValues: RidePreferences = {
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
    <MotionWrapper className="search-rides">
      <>
        <FormFilters
          initialValues={formInitialValues}
          handleObserverValues={handleObserverValues}>
          <RideFilters />
        </FormFilters>

        {filteredRides && <RideResults filteredRides={filteredRides} />}
      </>
    </MotionWrapper>
  );
};

export default SearchRides;
