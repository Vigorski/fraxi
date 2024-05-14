import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SavedDrivers from './SavedDrivers';
import PassengerPreferences from './PassengerPreferences';

const JourneyHub = () => {
  return (
    <div className="card card--stats">
      <Tabs>
        <div className="card__tabs card__radius--top--sm">
          <TabList>
            <Tab>Preferences</Tab>
            <Tab>Saved drivers</Tab>
          </TabList>
        </div>
        <TabPanel>
          <PassengerPreferences />
        </TabPanel>
        <TabPanel>
          <SavedDrivers />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default JourneyHub;
