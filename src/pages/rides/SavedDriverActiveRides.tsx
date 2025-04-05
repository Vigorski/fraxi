import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ActiveRides from 'components/rides/activeRides/ActiveRides';
import { getRidesState } from 'store/rides/ridesAsyncActions';
import { fetchUsers } from 'store/user/userAsyncActions';
import useQueryParameter from 'hooks/useQueryParameter';
import { itemVariants } from 'utilities/constants/framerVariants';
import { PAGE_NOT_FOUND } from 'utilities/constants/routesConfig';
import { decryptData } from 'utilities/helpers/encription';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { RideWithDriver } from 'types/ride';
import MotionWrapper from 'components/shared/MotionWrapper';

const SavedDriverActiveRides = () => {
  const [activeRides, setActiveRides] = useState<RideWithDriver[]>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getQuery = useQueryParameter();
  const driverId = getQuery('userId');

  useEffect(() => {
    const fetchDriverAndRides = async () => {
      try {
        if (!driverId) {
          throw new Error(
            'Invalid or malformed URL parameters: Unable to retrieve the ride information. Please check the URL and try again.',
          );
        }

        const decryptedDriverId = decryptData(
          driverId,
          process.env.REACT_APP_QUERY_PARAM_SECRET_KEY as string,
        );

        if (decryptedDriverId) {
          // there will always be only one driver retrieved here,
          // so we can destructure the first item in the returned array
          const [driverResponse] = await dispatch(
            fetchUsers({ usersIds: [decryptedDriverId] }),
          ).unwrap();

          const ridesResponse = await dispatch(
            getRidesState({ rideIds: driverResponse.activeRides }),
          ).unwrap();

          setActiveRides(ridesResponse.ridesWithTheirDriver);
        }
      } catch (error: any) {
        navigate(PAGE_NOT_FOUND.path, {
          state: {
            errorMessage: `${error.name}: Error when fetching specified driver and their active rides`,
          },
          replace: true,
        });
      }
    };

    fetchDriverAndRides();
  }, [driverId, navigate, dispatch]);

  if (!activeRides) return null;

  return (
    <MotionWrapper className="active-rides">
      <>
        <motion.div variants={itemVariants} className="mb-xl">
          <h5>Driver: </h5>
					<span>{`${activeRides[0].driverDetails.name} ${activeRides[0].driverDetails.surname}`}</span>
        </motion.div>
        <motion.h5
          variants={itemVariants}>
          Active rides
        </motion.h5>
        <div className="card__wrapper">
          <ActiveRides activeRides={activeRides} />
        </div>
      </>
    </MotionWrapper>
  );
};

export default SavedDriverActiveRides;
