import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from 'layout/Layout';
import { IconUserPlaceholder, IconEdit } from 'components/icons';
import JourneyHub from 'components/user/passenger/JourneyHub';
import { userLogout } from 'store/user/userAsyncActions';
import { USER_TYPES } from 'types/auth';
import { EDIT_USER, MY_PROFILE } from 'utilities/constants/routesConfig';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector(state => state.user);

  const handleLogout = async () => {
    await dispatch(userLogout()).unwrap();
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
            to={`${MY_PROFILE.path}${EDIT_USER.path}`}>
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

        {userDetails?.userType === USER_TYPES.passenger && (
          <motion.div variants={itemVariants}>
            <JourneyHub />
          </motion.div>
        )}
        {userDetails?.userType === USER_TYPES.driver && (
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
