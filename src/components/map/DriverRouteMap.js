import React, { useState } from 'react';
import CreateRouteInputs from './shared/CreateRouteInputs';
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
			<CreateRouteInputs
				origin={origin}
				destination={destination}
				setOrigin={setOrigin}
				setDestination={setDestination}
			/>
		</Map>
	);
};

export default DriverRouteMap;
