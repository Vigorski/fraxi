import React, { useState } from 'react';
import CreateRouteInputs from './shared/CreateRouteInputs';
import ReadonlyRouteInputs from './shared/ReadonlyRouteInputs';
import Map from './shared/Map';

const DriverRouteMap = ({
	originCity,
	destinationCity,
	waypoints,
	storeRouteMapDetails
}) => {
	const [origin, setOrigin] = useState(originCity ?? null);
	const [destination, setDestination] = useState(destinationCity ?? null);

	return (
		<Map
			origin={origin}
			destination={destination}
			waypoints={waypoints}
			directionsCallback={storeRouteMapDetails}
		>
			{
				originCity && destinationCity ?
					<ReadonlyRouteInputs
						origin={originCity}
						destination={destinationCity}
					/>
					:
					<CreateRouteInputs
						setOrigin={setOrigin}
						setDestination={setDestination}
					/>
			}
		</Map>
	);
};

export default DriverRouteMap;
