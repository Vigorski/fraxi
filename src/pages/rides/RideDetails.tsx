import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RideDetailsPassenger from 'components/rides/rideDetails/RideDetailsPassenger';
import RideDetailsDriver from 'components/rides/rideDetails/RideDetailsDriver';
import Layout from 'layout/Layout';
import { getRidesState } from 'store/rides/ridesAsyncActions';
import useQueryParameter from 'hooks/useQueryParameter';
import { USER_TYPES } from 'types/auth';
import { PAGE_NOT_FOUND } from 'utilities/constants/routesConfig';
import { decryptData } from 'utilities/helpers/encription';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { RideWithDriver } from 'types/ride';

const RideDetails = () => {
  // TODO: use the rideId from params to pull ride data from DB
  // TODO: (bug) ride passengers has same number after booking
  const [rideDetails, setRideDetails] = useState<RideWithDriver>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(state => state.user.userDetails);
  const isUserPassenger = userDetails?.userType === USER_TYPES.passenger;
  const isUserDriver = userDetails?.userType === USER_TYPES.driver;
  const getQuery = useQueryParameter();
  const rideId = getQuery('rideId');

  useEffect(() => {
    const fetchRideAndDriver = async () => {
      try {
        if (!rideId) {
          throw new Error(
            'Invalid or malformed URL parameters: Unable to retrieve the ride information. Please check the URL and try again.',
          );
        }

        const decryptedRideId = decryptData(
          rideId,
          process.env.REACT_APP_QUERY_PARAM_SECRET_KEY as string,
        );

        if (decryptedRideId) {
          const rideResponse = await dispatch(
            getRidesState({ rideIds: [decryptedRideId] }),
          ).unwrap();

          // there will always be only one ride retrieved here,
          // so we can access the first item in the returned array
          setRideDetails(rideResponse.ridesWithTheirDriver[0]);
        }
      } catch (error: any) {
        navigate(PAGE_NOT_FOUND.path, {
          state: {
            errorMessage: `${error.name}: Error when fetching specified driver and their ride`,
          },
          replace: true,
        });
      }
    };

    fetchRideAndDriver();
  }, [rideId, navigate, dispatch]);

  if (!rideDetails) return null;

  return (
    <Layout>
      <>
        {isUserPassenger && <RideDetailsPassenger rideDetails={rideDetails} />}
        {isUserDriver && <RideDetailsDriver rideDetails={rideDetails} />}
      </>
    </Layout>
  );
};

export default RideDetails;
