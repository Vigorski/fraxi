import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserPicture from 'components/shared/UserPicture';
import { fetchMultipleDrivers } from 'store/user/userAsyncActions';
import {
  DRIVER_ACTIVE_RIDES,
  MY_PROFILE,
} from 'utilities/constants/routesConfig';
import { itemVariants } from 'utilities/constants/framerVariants';

const SavedDrivers = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const [savedDrivers, setSavedDrivers] = useState();

  useEffect(() => {
    const getDrivers = async () => {
      const response = await dispatch(
        fetchMultipleDrivers({ driversIds: userDetails.savedDrivers }),
      ).unwrap();
      setSavedDrivers(response);
    };

    getDrivers();
  }, [userDetails.savedDrivers, dispatch]);

  if (savedDrivers) {
    return savedDrivers.map((driver, index) => {
      const lastItem = savedDrivers.length - 1;
      let cardSectionClassName = 'card__section ';

      // if only item
      if (savedDrivers.length === 1) {
        cardSectionClassName += 'card__radius--bottom';
        // if first item
      } else if (index === 0) {
        cardSectionClassName += 'pb-0';
        // if last item
      } else if (index === lastItem) {
        cardSectionClassName += 'card__radius--bottom pt-0';
      } else {
        cardSectionClassName += 'pv-0';
      }

      return (
        <Fragment key={`${driver.userId}_${index}`}>
          <div className={cardSectionClassName}>
            <div className="saved-driver">
              <div className="row">
                <div className="col-4">
                  <div className="thumbnail__user saved-driver__wrapper">
                    <UserPicture profilePicture={driver.profilePicture} />
                  </div>
                </div>
                <div className="col-8">
                  <div className="saved-driver__wrapper">
                    <h6>{`${driver.name} ${driver.surname}`}</h6>
                    <p>{`${driver.activeRides.length} active ride${
                      driver.activeRides.length > 1 ? 's' : ''
                    }`}</p>
                  </div>
                </div>
                <Link
                  className="saved-driver__link"
                  to={{
                    pathname: `${MY_PROFILE.path}${DRIVER_ACTIVE_RIDES.path}`,
                    state: { activeRides: driver.activeRides },
                  }}
                />
              </div>
            </div>
          </div>
          {index < lastItem && (
            <div className="card__stamp">
              <div className="card__stamp-border" />
            </div>
          )}
        </Fragment>
      );
    });
  }

  return (
    <motion.div className="card__section card__radius--bottom">
      <h5 variants={itemVariants}>You haven't saved anyone yet :(</h5>
    </motion.div>
  );
};

export default SavedDrivers;
