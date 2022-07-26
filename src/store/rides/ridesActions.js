import { ridesActions } from './ridesSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE } from '../../utilities/constants/routes';
import { MKD_CITIES_ABBREVIATED } from '../../utilities/constants/cities';
import { arrayUnion } from 'firebase/firestore';

const cityAbbr = Object.keys(MKD_CITIES_ABBREVIATED);
const citiesFull = Object.values(MKD_CITIES_ABBREVIATED);

const transformRideValues = (driverId, values) => {
	const newRideId = 'ride_' + Math.random().toString(16).slice(2) + '_' + Date.now();
	const creationDate = new Date().toUTCString();
	const departureDateParsed = values.departureDate.toUTCString();
	const indexOfOrigin = citiesFull.indexOf(values.origin);
	const indexOfDestination = citiesFull.indexOf(values.destination);

	return {
		...values,
		departureDate: departureDateParsed,
		rideId: newRideId,
		driverId,
		passengers: [],
		creationDate,
		status: 'active',
		originAbbr: cityAbbr[indexOfOrigin],
		destinationAbbr: cityAbbr[indexOfDestination],
	};
};

export const addNewRide = (driverId, values, history) => {
	const transformedValues = transformRideValues(driverId, values);

	return async dispatch => {
		dispatch(httpActions.requestSend);
		try {
			await addFBWithId('/rides', transformedValues, transformedValues.rideId);
			await updateFB('/users', driverId, { activeRides: arrayUnion(transformedValues.rideId) }, true);
			dispatch(httpActions.requestSuccess());
			dispatch(ridesActions.addActiveRide(transformedValues));
			history.push(MY_PROFILE);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const getUserActiveRides = driverId => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			const responseData = await getFB('/rides', { driverId }, ['driverId']);

			if (responseData.length > 0) {
				dispatch(ridesActions.populateActiveRides(responseData));
				dispatch(httpActions.requestSuccess());
			}
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};
