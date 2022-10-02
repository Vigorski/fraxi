import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { MY_PROFILE } from '../../../utilities/constants/routes';

const PassengerPreferences = ({ridePreferences}) => {
  const { origin, destination, numOfStops, rideType, smoking } = ridePreferences !== undefined ? ridePreferences : {};

	return (
		<div className='card card--stats'>
			<Tabs>
				<div className='card__tabs card__radius--top--sm'>
					<TabList>
						<Tab>Preferences</Tab>
						<Tab>Saved drivers</Tab>
					</TabList>
				</div>
				<TabPanel>
					<div className='card__section text-center pb-0'>
						<Link to={`${MY_PROFILE.path}/edit-preferences`}>Edit Preferences</Link>
					</div>
					<div className="card__stamp">
						<div className="card__stamp-border" />
					</div>
					<div className='card__section pv-0'>
						<dl className='list-desc__columns profile__routes'>
							<div className='list-desc__col'>
								<dt>Origin</dt>
								<dd>{origin ?? 'N/A'}</dd>
							</div>
							<div className='list-desc__col'>
								<dt>Destination</dt>
								<dd>{destination ?? 'N/A'}</dd>
							</div>
						</dl>
					</div>
					<div className="card__stamp">
						<div className="card__stamp-border" />
					</div>
					<div className='card__section card__radius--bottom pt-0'>
						<dl className='list-desc__rows'>
							<div className='list-desc__row'>
								<dt># of Stops</dt>
								<dd>{numOfStops ?? 'N/A'}</dd>
							</div>
							<div className='list-desc__row'>
								<dt>Type of ride</dt>
								<dd>{rideType ?? 'N/A'}</dd>
							</div>
							<div className='list-desc__row'>
								<dt>Smoking</dt>
								<dd>{smoking ? 'smoking' : 'non-smoking'}</dd>
							</div>
						</dl>
					</div>
				</TabPanel>
				<TabPanel>saved drivers here</TabPanel>
			</Tabs>
		</div>
	);
};

export default PassengerPreferences;
