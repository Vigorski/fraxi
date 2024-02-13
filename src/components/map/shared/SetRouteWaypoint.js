import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@react-google-maps/api';
import { removeAutocompletePacContainer } from 'utilities/helpers';

const SetRouteWaypoint = ({ setWaypoints, randomProp }) => {
	const { userId } = useSelector(state => state.user.userDetails);
	const waypointObjRef = useRef(null);

	const handleWaypointChange = () => {
		const place = waypointObjRef.current.getPlace();
		const geoPoint = place.geometry.location;
		const formatted_address = place.formatted_address;
		const location = {
			lat: geoPoint.lat(),
			lng: geoPoint.lng()
		}
		
		setWaypoints(prev => {
			const newWaypoint = {
				userId,
				location,
				formatted_address,
				stopover: true
			};

			const waypointIndex = prev.findIndex(
				waypoint => waypoint.userId === userId
			);

			if (waypointIndex < 0) {
				return [...prev, newWaypoint];
			} else {
				return [
					...prev.slice(0, waypointIndex),
					newWaypoint,
					...prev.slice(waypointIndex + 1)
				];
			}
		});
	};

	useEffect(() => {
		return () => {
			removeAutocompletePacContainer(waypointObjRef.current);
		}
	}, []);

	return (
		<>
			<div className="form-field">
				<label htmlFor="waypoint">Pick up location</label>
				<Autocomplete
					onLoad={ac => {
						waypointObjRef.current = ac;
					}}
					onPlaceChanged={handleWaypointChange}
				>
					<input type="text" id="waypoint" placeholder="Set pick up location" />
				</Autocomplete>
			</div>
		</>
	);
};

export default SetRouteWaypoint;
