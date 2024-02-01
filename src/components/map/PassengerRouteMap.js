import React, { useState } from 'react';
import SetRouteWaypoint from './shared/SetRouteWaypoint';
import Map from './shared/Map';

const PassengerRouteMap = ({ originCity, destinationCity, waypoints, storeRouteMapDetails }) => {
	// state only for waypoints. storeRouteMapDetails contains the entire route
	const [newWaypoints, setNewWaypoints] = useState(waypoints);

	return (
		<Map
			origin={originCity}
			destination={destinationCity}
			waypoints={newWaypoints}
			directionsCallback={storeRouteMapDetails}
		>
			<SetRouteWaypoint setWaypoints={setNewWaypoints} />
		</Map>
	);
};

export default PassengerRouteMap;
