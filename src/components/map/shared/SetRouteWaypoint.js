import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@react-google-maps/api';

const CreateRouteInputs = ({ setWaypoints, randomProp }) => {
	const { userId } = useSelector(state => state.user.userDetails);
	const waypointObjRef = useRef(null);

	const handleWaypointChange = () => {
		const geoPoint = waypointObjRef.current.getPlace().geometry.location;
		const location = {
			lat: geoPoint.lat(),
			lng: geoPoint.lng()
		}

		setWaypoints(prev => {
			const newWaypoint = {
				userId,
				location,
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

	return (
		<>
			<div className="form-field">
				<label htmlFor="origin">Pick up location</label>
				<Autocomplete
					onLoad={ac => {
						waypointObjRef.current = ac;
					}}
					onPlaceChanged={handleWaypointChange}
				>
					<input type="text" id="origin" placeholder="Set pick up location" />
				</Autocomplete>
			</div>
		</>
	);
};

export default CreateRouteInputs;
