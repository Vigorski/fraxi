import { motion } from "framer-motion";
import Layout from "layout/Layout";
import {
  mainContainerVariants,
  itemVariants,
} from "utilities/constants/framerVariants";
import RegisterEditUser from "./RegisterEditUser";

const EditMyProfile = () => {
  return (
    <Layout>
      <motion.section
        className="profile profile--edit"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden"
      >
        <motion.h3 variants={itemVariants}>Edit profile</motion.h3>
        <RegisterEditUser editUserProfile={true} />
      </motion.section>
    </Layout>
  );
};

export default EditMyProfile;
