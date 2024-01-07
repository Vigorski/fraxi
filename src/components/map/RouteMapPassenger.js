import React, { useState } from 'react';
import SetRouteWaypoint from './shared/SetRouteWaypoint';
import Map from './shared/Map';

const RouteMapPassenger = ({ originCity, destinationCity, waypoints, userId, storeRouteMapDetails }) => {
	const [newWaypoints, setNewWaypoints] = useState(waypoints);

	return (
		<Map
			origin={originCity}
			destination={destinationCity}
			waypoints={newWaypoints}
			directionsCallback={storeRouteMapDetails}
		>
			<SetRouteWaypoint setWaypoints={setNewWaypoints} userId={userId} />
		</Map>
	);
};

export default RouteMapPassenger;
