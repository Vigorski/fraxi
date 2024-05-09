import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import ActiveRides from 'components/rides/activeRides/ActiveRides';
import { getRidesState } from 'store/rides/ridesAsyncActions';
import { fetchUsers } from 'store/user/userAsyncActions';
import useQueryParameter from 'hooks/useQueryParameter';
import {
  itemVariants,
  mainContainerVariants,
} from 'utilities/constants/framerVariants';
import { PAGE_NOT_FOUND } from 'utilities/constants/routesConfig';
import { decryptData } from 'utilities/helpers/encription';

const SavedDriverActiveRides = () => {
  const [activeRides, setActiveRides] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const [getQuery] = useQueryParameter();
  const driverId = getQuery('userId');

  useEffect(() => {
    const fetchDriverAndRides = async () => {
      try {
        const decryptedDriverId = decryptData(
          driverId,
          process.env.REACT_APP_QUERY_PARAM_SECRET_KEY,
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

          setActiveRides(ridesResponse.ridesAndDrivers);
        }
      } catch (error) {
        history.replace(PAGE_NOT_FOUND.path, {
          errorMessage: `${error.name}: Error when fetching specified driver and their active rides`,
        });
      }
    };

    fetchDriverAndRides();
  }, [driverId, history, dispatch]);

  return (
    <Layout>
      <motion.section
        className="active-rides"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        {activeRides && (
          <>
            <motion.div variants={itemVariants} className="mb-xl">
              <p className="text-xs text-primary">Driver</p>
              <h4>{`${activeRides[0].driverDetails.name} ${activeRides[0].driverDetails.surname}`}</h4>
            </motion.div>
            <motion.p variants={itemVariants} className="text-xs text-primary">
              Active rides
            </motion.p>
          </>
        )}
        <div className="card__wrapper">
          <ActiveRides activeRides={activeRides} />
        </div>
      </motion.section>
    </Layout>
  );
};

export default SavedDriverActiveRides;
