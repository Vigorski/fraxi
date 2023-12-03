import { useState, useRef, useEffect, memo, useCallback } from 'react';
import {
	useJsApiLoader,
	GoogleMap,
	Marker,
	Autocomplete,
	DirectionsRenderer
} from '@react-google-maps/api';

const libraries = ['places'];

const Map = ({
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

	const [map, setMap] = useState(/** @type google.maps.Map */ (null));
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [directions, setDirections] = useState(null);
	// const originMarkerRef = useRef(null);
  // const destinationMarkerRef = useRef(null);
  const originObjRef = useRef(null);
  const destinationObjRef = useRef(null);

	const onLoad = map => {
		setMap(map);
	};
console.log('before component')
	const onDirectionsChanged = () => {
		if (map) {
			const directionsRenderer = new window.google.maps.DirectionsRenderer();
			directionsRenderer.setMap(map);
			directionsRenderer.setDirections(directions);
		}
	};

	useEffect(() => {
		console.log('inside useEffect - setting destination');
		if (origin && destination) {
			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
				{
					origin,
					destination,
					travelMode: window.google.maps.TravelMode.DRIVING
				},
				(result, status) => {
					if (status === window.google.maps.DirectionsStatus.OK) {
						setDirections(result);
					} else {
						console.error(`Error fetching directions ${result}`);
					}
				}
			);
		}
	}, [origin, destination]);

	const handleOriginChange = () => {
		setOrigin(originObjRef.current.getPlace().formatted_address);
		console.log(originObjRef.current.getPlace())
	};

	const handleDestinationChange = () => {
		setDestination(destinationObjRef.current.getPlace().formatted_address);
	};

	if (loadError) {
		return <div>Error loading Google Maps API: {loadError.message}</div>;
	}

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<>
		{console.log('inside comp')}
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
			<div className="map__wrapper">
				{/* {directionsResponse && (
					<div className="map__distance">
						{distance} / {duration}
					</div>
				)} */}
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
					onLoad={onLoad}
					onUnmount={() => setMap(null)}
				>
					{/* {origin && (
						<Marker
							position={{ lat: parseFloat(origin.split(',')[0]), lng: parseFloat(origin.split(',')[1]) }}
							draggable={true}
							onDragEnd={(e) => onMarkerDragEnd('origin', e)}
							ref={originMarkerRef}
						/>
					)}
					{destination && (
						<Marker
							position={{ lat: parseFloat(destination.split(',')[0]), lng: parseFloat(destination.split(',')[1]) }}
							draggable={true}
							onDragEnd={(e) => onMarkerDragEnd('destination', e)}
							ref={destinationMarkerRef}
						/>
					)} */}
					{directions && (
						<DirectionsRenderer
							directions={directions}
							onChange={onDirectionsChanged}
						/>
					)}
				</GoogleMap>
			</div>
		</>
	);
};

export default memo(Map);
