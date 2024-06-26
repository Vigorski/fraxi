import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from 'layout/Layout';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import { userUpdate } from 'store/user/userAsyncActions';
import RegisterEditUser from '../../components/auth/RegisterEditUser';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import { REGISTER_TYPES } from 'utilities/constants/registerTypes';

const EditMyProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userDetails = useSelector(state => state.user.userDetails);
  const editUserConfig = {
    registerType: REGISTER_TYPES.edit,
    name: userDetails.name,
    surname: userDetails.surname,
    phone: userDetails.phone,
    profilePicture: userDetails.profilePicture
  }

  const handleSubmitEdit = async (values) => {
    await dispatch(
      userUpdate({ userId: userDetails.userId, values }),
    ).unwrap();
    history.push(MY_PROFILE.path);
  }

  return (
    <Layout>
      <motion.section
        className="profile profile--edit"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.h3 variants={itemVariants}>Edit profile</motion.h3>
        <RegisterEditUser authConfig={editUserConfig} handleSubmit={handleSubmitEdit} />
      </motion.section>
    </Layout>
  );
};

export default EditMyProfile;
