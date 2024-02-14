import React, { useState } from 'react';
import SetRouteWaypoint from './shared/SetRouteWaypoint';
import ReadonlyRouteWaypoint from './shared/ReadonlyRouteWaypoint';
import Map from './shared/Map';
import { useSelector } from 'react-redux';

const PassengerRouteMap = ({ originCity, destinationCity, waypoints, storeRouteMapDetails }) => {
	// state only for waypoints. storeRouteMapDetails contains the entire route
	const [newWaypoints, setNewWaypoints] = useState(waypoints);
	const { userId } = useSelector(state => state.user.userDetails);
	const ownWaypoint = waypoints.find(waypoint => waypoint.userId === userId);

	return (
		<Map
			origin={originCity}
			destination={destinationCity}
			waypoints={newWaypoints}
			directionsCallback={storeRouteMapDetails}
		>
			{
				ownWaypoint ?
					<ReadonlyRouteWaypoint waypoint={ownWaypoint} /> :
					<SetRouteWaypoint setWaypoints={setNewWaypoints} />
			}
		</Map>
	);
};

export default PassengerRouteMap;
