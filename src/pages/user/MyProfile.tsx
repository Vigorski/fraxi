import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconUserPlaceholder } from 'components/icons';
import JourneyHub from 'components/user/passenger/JourneyHub';
import { USER_TYPES } from 'types/auth';
import { CREATE_RIDE } from 'utilities/constants/routesConfig';
import { itemVariants } from 'utilities/constants/framerVariants';
import { useAppSelector } from 'hooks/useAppSelector';
import MotionWrapper from 'components/shared/MotionWrapper';

const MyProfile = () => {
  const { userDetails } = useAppSelector(state => state.user);

  return (
    <MotionWrapper
      className="profile"
      data-bg-text={`${userDetails?.name} ${userDetails?.surname}`}>
      <>
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
            <Link to={CREATE_RIDE.path} className="btn-primary btn-block">
              Create a new ride
            </Link>
          </motion.div>
        )}
      </>
    </MotionWrapper>
  );
};

export default MyProfile;
