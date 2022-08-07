import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { MY_PROFILE } from '../../../utilities/constants/routes';

const PassengerPreferences = ({routePreferences}) => {
  const { origin, destination, numOfStops, routeType, smoking } = routePreferences !== undefined ? routePreferences : {};

	return (
		<div className='card card--stats'>
			<Tabs>
				<div className='card__tabs card__section--clip card__section--border-dashed'>
					<TabList>
						<Tab>Preferences</Tab>
						<Tab>Saved drivers</Tab>
					</TabList>
				</div>
				<TabPanel>
					<div className='card__section card__section card__section--clip card__section--border-dashed text-center'>
						<Link to={`${MY_PROFILE.path}/edit-preferences`}>Edit Preferences</Link>
					</div>
					<div className='card__section card__section--border-dashed'>
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
					<div className='card__section'>
						<dl className='list-desc__rows'>
							<div className='list-desc__row'>
								<dt># of Stops</dt>
								<dd>{numOfStops ?? 'N/A'}</dd>
							</div>
							<div className='list-desc__row'>
								<dt>Route</dt>
								<dd>{routeType ?? 'N/A'}</dd>
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
