import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserPicture from 'components/shared/UserPicture';
import { fetchUsers } from 'store/user/userAsyncActions';
import {
  DRIVER_ACTIVE_RIDES,
  MY_PROFILE,
} from 'utilities/constants/routesConfig';
import { itemVariants } from 'utilities/constants/framerVariants';
import { encryptData } from 'utilities/helpers/encription';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { User } from 'types/user';

const SavedDrivers = () => {
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector(state => state.user);
  const [savedDrivers, setSavedDrivers] = useState<User[]>();

  useEffect(() => {
    if (userDetails?.savedDrivers) {
      const getDrivers = async () => {
        const response = await dispatch(
          fetchUsers({ usersIds: userDetails.savedDrivers }),
        ).unwrap();
        setSavedDrivers(response);
      };

      getDrivers();
    }
  }, [userDetails?.savedDrivers, dispatch]);

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

      const encryptedDriverId = encryptData(
        driver.userId,
        process.env.REACT_APP_QUERY_PARAM_SECRET_KEY as string,
      );

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
                  to={`${MY_PROFILE.path}${DRIVER_ACTIVE_RIDES.path}?userId=${encryptedDriverId}`}
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
    <motion.div
      variants={itemVariants}
      className="card__section card__radius--bottom">
      <h5>You haven't saved anyone yet :/</h5>
    </motion.div>
  );
};

export default SavedDrivers;
