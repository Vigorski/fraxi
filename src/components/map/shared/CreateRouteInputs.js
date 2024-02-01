import { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { aggregateRouteDetails } from 'utilities/helpers';

const CreateRouteInputs = ({
	origin,
	setOrigin,
	destination,
	setDestination
}) => {
	const originObjRef = useRef(null);
	const destinationObjRef = useRef(null);

	const handleOriginChange = () => {
		setOrigin(aggregateRouteDetails(originObjRef.current.getPlace()));
	};

	const handleDestinationChange = () => {
		setDestination(aggregateRouteDetails(destinationObjRef.current.getPlace()));
	};

	return (
		<>
			<div className={`form-field ${origin ? 'form-field--disabled' : ''}`}>
				<label htmlFor="origin">Origin</label>
				{origin ? (
					<input
						type="text"
						id="origin"
						value={origin.formatted_address}
						disabled
						placeholder="Enter origin"
					/>
				) : (
					<Autocomplete
						onLoad={ac => {
							originObjRef.current = ac;
						}}
						onPlaceChanged={handleOriginChange}
					>
						<input type="text" id="origin" placeholder="Enter origin" />
					</Autocomplete>
				)}
			</div>
			<div className={`form-field ${destination ? 'form-field--disabled' : ''}`}>
				<label htmlFor="destination">Destination</label>
				{destination ? (
					<input
						type="text"
						id="origin"
						value={destination.formatted_address}
						disabled
						placeholder="Enter origin"
					/>
				) : (
					<Autocomplete
						onLoad={ac => {
							destinationObjRef.current = ac;
						}}
						onPlaceChanged={handleDestinationChange}
					>
						<input
							type="text"
							id="destination"
							placeholder="Enter destination"
						/>
					</Autocomplete>
				)}
			</div>
		</>
	);
};

export default CreateRouteInputs;
