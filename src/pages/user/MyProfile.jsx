import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import { IconUserPlaceholder, IconEdit } from 'components/icons';
import { userLogout } from 'store/user/userActions';
import { DRIVER, PASSENGER } from 'utilities/constants/users';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import PassengerPreferences from './passenger/PassengerPreferences';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);
  const ridePreferences = userDetails?.ridePreferences;

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <Layout>
      <motion.section
        className="profile"
        data-bg-text={`${userDetails?.name} ${userDetails?.surname}`}
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.div className="profile__edit" variants={itemVariants}>
          <Link
            className="btn-icon-center btn-stripped"
            to={`${MY_PROFILE.path}/edit-user`}>
            <IconEdit />
          </Link>
        </motion.div>
        <motion.div className="profile__img" variants={itemVariants}>
          {!!userDetails?.profilePicture ? (
            <img src={userDetails.profilePicture} alt="user avatar" />
          ) : (
            <div className="profile__svg-wrapper">
              <IconUserPlaceholder />
            </div>
          )}
        </motion.div>
        <motion.h4 className="profile__name" variants={itemVariants}>
          {userDetails?.name} {userDetails?.surname}
        </motion.h4>

        {userDetails?.userType === PASSENGER && (
          <motion.div variants={itemVariants}>
            <PassengerPreferences ridePreferences={ridePreferences} />
          </motion.div>
        )}
        {userDetails?.userType === DRIVER && (
          <motion.div variants={itemVariants}>
            <Link
              to={`${MY_PROFILE.path}/create-ride`}
              className="btn-primary btn-block">
              Create a new ride
            </Link>
          </motion.div>
        )}

        <motion.button
          className="btn-primary btn-block btn-sm mt-xxl"
          variants={itemVariants}>
          Load Rides History
        </motion.button>
        <motion.button
          className="btn-primary-ghost btn-block btn-sm mt-xxl"
          onClick={handleLogout}
          variants={itemVariants}>
          Logout
        </motion.button>
      </motion.section>
    </Layout>
  );
};

export default MyProfile;
