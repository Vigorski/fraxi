import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserPicture from 'components/shared/UserPicture';
import { fetchMultipleDrivers } from 'store/user/userAsyncActions';
import { MY_PROFILE } from 'utilities/constants/routesConfig';

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

  return savedDrivers?.map((driver, index) => {
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
      <Fragment key={`${driver.name}_${driver.surname}_${index}`}>
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
                to={`${MY_PROFILE.path}/saved-driver?data=${driver.userId}`}
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
};

export default SavedDrivers;
