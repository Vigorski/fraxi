import React, { useState, useRef, useEffect, memo } from 'react';
import {
	useJsApiLoader,
	GoogleMap,
	// Marker,
	Autocomplete,
	DirectionsRenderer
} from '@react-google-maps/api';
import { aggregateRouteDetails } from '../../utilities/helpers';
// import { IconMarker } from '../icons';

const libraries = ['places'];

const Map = ({
	children,
	center,
	zoom,
	originCity,
	destinationCity,
	storeRouteMapDetails
}) => {
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries: libraries
	});

	// const [map, setMap] = useState(/** @type google.maps.Map */ (null));
	const [origin, setOrigin] = useState(originCity ?? undefined);
	const [destination, setDestination] = useState(destinationCity ?? undefined);
	const [directions, setDirections] = useState(null);
	// const originMarkerRef = useRef(null);
  // const destinationMarkerRef = useRef(null);
  const originObjRef = useRef(null);
  const destinationObjRef = useRef(null);

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
			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
				{
					origin: origin.formatted_address,
					destination: destination.formatted_address,
					travelMode: window.google.maps.TravelMode.DRIVING
				},
				(result, status) => {
					if (status === window.google.maps.DirectionsStatus.OK) {
						const directionsAugmentedData = {
							origin: aggregateRouteDetails(origin),
							destination: aggregateRouteDetails(destination),
							waypoints: [],
							travelMode: window.google.maps.TravelMode.DRIVING
						};

						setDirections(result);
						storeRouteMapDetails(directionsAugmentedData);
					} else {
						console.error(`Error fetching directions ${result}`);
					}
				}
			);
		}
	}, [origin, destination, isLoaded, storeRouteMapDetails]);

	const handleOriginChange = () => {
		setOrigin(originObjRef.current.getPlace());
	};
	
	const handleDestinationChange = () => {
		setDestination(destinationObjRef.current.getPlace());
	};

	if (loadError) {
		return <div>Error loading Google Maps API: {loadError.message}</div>;
	}

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="form-field">
				<label htmlFor="origin">Origin</label>
				<Autocomplete onLoad={(ac => {originObjRef.current = ac})} onPlaceChanged={handleOriginChange}>
					<input
						type="text"
						id="origin"
						placeholder="Enter origin"
						// value={origin}
						// onChange={e => setOrigin(e.target.value)}
					/>
				</Autocomplete>
			</div>
			<div className="form-field">
				<label htmlFor="destination">Destination</label>
				<Autocomplete onLoad={(ac => {destinationObjRef.current = ac})} onPlaceChanged={handleDestinationChange}>
					<input
						type="text"
						id="destination"
						placeholder="Enter destination"
						// value={destination}
						// onChange={e => setDestination(e.target.value)}
					/>
				</Autocomplete>
			</div>

			{children && React.cloneElement(children, { origin: origin })}

			<div className="map__wrapper">
				{directions && (
					<div className="map__distance">
						{directions.routes[0].legs[0].distance.text} / {directions.routes[0].legs[0].duration.text}
					</div>
				)}
				<GoogleMap
					center={center}
					zoom={zoom}
					mapContainerStyle={{ width: '100%', height: '500px' }}
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

export default memo(Map);
