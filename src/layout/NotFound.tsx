import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  mainContainerVariants,
  itemVariants,
} from 'utilities/constants/framerVariants';
import { LocationState } from 'types/router';

const NotFound: FC = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const errorMessage = locationState?.errorMessage;

  return (
    <div className="not-found">
      <motion.section
        className="not-found__main"
        data-bg-text="Wrong way!"
        variants={mainContainerVariants}
        initial="initial"
        animate="visible"
        exit="hidden">
        <motion.div className="text-center" variants={itemVariants}>
          <h2 className="text-primary">Page not found!</h2>
        </motion.div>
        {errorMessage && (
          <motion.div className="text-center mt-xl" variants={itemVariants}>
            <span className="text-white">{errorMessage}</span>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default NotFound;
