import { v4 as uuidv4 } from 'uuid';

import { ridesActions } from './ridesSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE } from '../../utilities/constants/routes';
import { MKD_CITIES_ABBREVIATED } from '../../utilities/constants/cities';
import { arrayUnion } from 'firebase/firestore';

const cityAbbr = Object.keys(MKD_CITIES_ABBREVIATED);
const citiesFull = Object.values(MKD_CITIES_ABBREVIATED);

const transformRideValues = (driverId, values) => {
	const newRideId = 'ride_' + uuidv4();
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
		numOfStops: null,
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
			history.push(MY_PROFILE.path);
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

export const getFilteredRides = ridePreferences => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			const uniqueDriverIds = [];
			// TODO: make additional conditional filters for less important aspects
			const ridesResponse = await getFB('/rides', ridePreferences, ['destination', 'origin', 'rideType', 'smoking']);
			
			for (const ride of ridesResponse) {
				if( uniqueDriverIds.indexOf(ride.driverId) === -1 ) {
					uniqueDriverIds.push(ride.driverId);
				}
			}

			const driversResponse = await Promise.all(
				uniqueDriverIds.map(driver => getFB('/users', {userId: driver}, ['userId']))
			);

			const updatedRides = ridesResponse.map( ride => {
				// using the first index of the response since it always returns an array which will only have a single item
				const driverDetails = driversResponse.find(driver => driver[0].userId === ride.driverId);
				return {...ride, driverDetails: driverDetails[0]}
			} );

			dispatch(ridesActions.populateFilteredRides(updatedRides));
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};