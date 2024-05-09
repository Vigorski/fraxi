import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RideDetailsPassenger from 'components/rides/rideDetails/RideDetailsPassenger';
import RideDetailsDriver from 'components/rides/rideDetails/RideDetailsDriver';
import Layout from 'layout/Layout';
import { getRidesState } from 'store/rides/ridesAsyncActions';
import useQueryParameter from 'hooks/useQueryParameter';
import { USER_TYPES } from 'utilities/constants/userTypes';
import { PAGE_NOT_FOUND } from 'utilities/constants/routesConfig';
import { decryptData } from 'utilities/helpers/encription';

const RideDetails = () => {
  // TODO: use the rideId from params to pull ride data from DB
  // TODO: (bug) ride passengers has same number after booking
  const [rideDetails, setRideDetails] = useState();
  const history = useHistory();
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.user.userDetails);
  const isUserPassenger = userDetails.userType === USER_TYPES.passenger;
  const isUserDriver = userDetails.userType === USER_TYPES.driver;
  const [getQuery] = useQueryParameter();
  const rideId = getQuery('rideId');

  useEffect(() => {
    const fetchRideAndDriver = async () => {
      try {
        const decryptedRideId = decryptData(
          rideId,
          process.env.REACT_APP_QUERY_PARAM_SECRET_KEY,
        );

        if (decryptedRideId) {
          const rideResponse = await dispatch(
            getRidesState({ rideIds: [decryptedRideId] }),
          ).unwrap();

          // there will always be only one ride retrieved here,
          // so we can access the first item in the returned array
          setRideDetails(rideResponse.ridesAndDrivers[0]);
        }
      } catch (error) {
        history.replace(PAGE_NOT_FOUND.path, {
          errorMessage: `${error.name}: Error when fetching specified driver and their ride`,
        });
      }
    };

    fetchRideAndDriver();
  }, [rideId, history, dispatch]);

  if (!rideDetails) return null;

  return (
    <Layout>
      {isUserPassenger && <RideDetailsPassenger rideDetails={rideDetails} />}
      {isUserDriver && <RideDetailsDriver rideDetails={rideDetails} />}
    </Layout>
  );
};

export default RideDetails;
