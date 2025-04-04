import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SavedDrivers from './SavedDrivers';
import PassengerPreferences from './PassengerPreferences';
import { motion } from 'framer-motion';
import { itemVariants } from 'utilities/constants/framerVariants';

const JourneyHub = () => {
  return (
    <motion.div variants={itemVariants}>
      <Tabs>
				<TabList>
					<Tab>Preferences</Tab>
					<Tab>Saved drivers</Tab>
				</TabList>
        <TabPanel>
          <PassengerPreferences />
        </TabPanel>
        <TabPanel>
          <SavedDrivers />
        </TabPanel>
      </Tabs>
    </motion.div>
  );
};

export default JourneyHub;
