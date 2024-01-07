import React, { useState } from 'react';
import CreateRouteInputs from './shared/CreateRouteInputs';
import Map from './shared/Map';

const CreateRouteMap = ({
	originCity,
	destinationCity,
	storeRouteMapDetails
}) => {
	const [origin, setOrigin] = useState(originCity ?? undefined);
	const [destination, setDestination] = useState(destinationCity ?? undefined);

	return (
		<Map
			origin={origin}
			destination={destination}
			directionsCallback={storeRouteMapDetails}
		>
			<CreateRouteInputs
				setOrigin={setOrigin}
				setDestination={setDestination}
			/>
		</Map>
	);
};

export default CreateRouteMap;
