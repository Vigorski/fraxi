import React, { useState, useEffect, memo } from 'react';
import {
	useJsApiLoader,
	GoogleMap,
	// Marker,
	DirectionsRenderer
} from '@react-google-maps/api';
// import { IconMarker } from '../icons';

const libraries = ['places'];

const Map = ({
	children,
	origin,
	destination,
	waypoints,
	directionsCallback
}) => {
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries: libraries
	});
	// const [map, setMap] = useState(/** @type google.maps.Map */ (null));
	const [directions, setDirections] = useState(null);
	// const originMarkerRef = useRef(null);
	// const destinationMarkerRef = useRef(null);

	// const onLoad = map => {
	// 	setMap(map);
	// };

	// const onDirectionsChanged = () => {
	// 	if (map) {
	// 		const directionsRenderer = new window.google.maps.DirectionsRenderer();
	// 		directionsRenderer.setMap(map);
	// 		directionsRenderer.setDirections(directions);
	// 		console.log(directions)
	// 	}
	// };

	useEffect(() => {
		if (origin && destination && isLoaded) {
			const recunstructedWaypoints = waypoints.map(waypoint => ({
				location: waypoint.location,
				stopover: waypoint.stopover
			}));

			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
				{
					origin: origin.formatted_address,
					destination: destination.formatted_address,
					waypoints: recunstructedWaypoints.length
						? recunstructedWaypoints
						: [],
					optimizeWaypoints: true,
					travelMode: window.google.maps.TravelMode.DRIVING
				},
				(result, status) => {
					if (status === window.google.maps.DirectionsStatus.OK) {
						setDirections(result);
						directionsCallback &&
							directionsCallback({ origin, destination, waypoints });
					} else {
						console.error(`Error fetching directions ${result}`);
					}
				}
			);
		}
	}, [origin, destination, waypoints, isLoaded, directionsCallback]);

	if (loadError) {
		return <div>Error loading Google Maps API: {loadError.message}</div>;
	}

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<>
			{/*
				children is currently used for inserting input fields to handle directions and waypoints.
				It gives the advantage of passing props directly from the Map to children,
				but it is not being used at the moment.
				This can be removed from Map and placed as a sibling to it for greater flexibility 
				in terms of the elements position.
			*/}
			{children && React.cloneElement(children, { testProp: 'test-prop' })}

			<div className="map__wrapper">
				{directions && (
					<div className="map__distance">
						{directions.routes[0].legs[0].distance.text} /{' '}
						{directions.routes[0].legs[0].duration.text}
					</div>
				)}
				<GoogleMap
					mapContainerStyle={{ width: '100%', height: '500px' }}
					center={{ lat: 41.6, lng: 21.7 }}
					zoom={8}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
						mapId: process.env.REACT_APP_GOOGLE_MAP_ID
					}}
					// onLoad={onLoad}
					// onUnmount={() => setMap(null)}
				>
					{directions && (
						<DirectionsRenderer
							directions={directions}
							// onChange={onDirectionsChanged}
							// options={{
							// 	polylineOptions: {
							// 		strokeColor: '#2093cf',
							// 		strokeOpacity: 0.8,
							// 		strokeWeight: 4,
							// 	},
							// 	markerOptions: {
							// 		icon: {
							// 			// component: <IconMarker />
							// 			icon: '../../assets/icons/location.svg',
							// 			scaledSize: new window.google.maps.Size(40, 40)
							// 		},
							// 	},
							// }}
						/>
					)}
				</GoogleMap>
			</div>
		</>
	);
};

Map.defaultProps = {
	waypoints: []
}
export default memo(Map);
