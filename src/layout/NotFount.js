import { motion } from "framer-motion";
import {
  mainContainerVariants,
  itemVariants,
} from "utilities/constants/framerVariants";

const NotFound = () => {
  return (
    <div className="container">
      <main>
        <motion.section
          className="not-found"
          data-bg-text="Wrong way!"
          variants={mainContainerVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h3>Page not found!</h3>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};

export default NotFound;
