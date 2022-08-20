import { v4 as uuidv4 } from 'uuid';

import { userActions } from '../user/userSlice';
import { ridesActions } from './ridesSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE, ACTIVE_RIDES } from '../../utilities/constants/routes';
import { MKD_CITIES_ABBREVIATED } from '../../utilities/constants/cities';
import { arrayUnion, arrayRemove } from 'firebase/firestore';

const cityAbbr = Object.keys(MKD_CITIES_ABBREVIATED);
const citiesFull = Object.values(MKD_CITIES_ABBREVIATED);

const addDriverToRide = (rides, drivers) => {
	const updatedRides = rides.map(ride => {
		// using the first index of the response since it always returns an array which will only have a single item
		const driverDetails = drivers.find(driver => driver[0].userId === ride.driverId);
		return { ...ride, driverDetails: driverDetails[0] };
	});

	return updatedRides;
}

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

export const addNewRide = (driver, values, history) => {
	const transformedValues = transformRideValues(driver.userId, values);
	const transformedDriverActiveRides = { activeRides: [...driver.activeRides, transformedValues.rideId] };

	return async dispatch => {
		dispatch(httpActions.requestSend);
		try {
			await addFBWithId('/rides', transformedValues, transformedValues.rideId);
			await updateFB('/users', driver.userId, { activeRides: arrayUnion(transformedValues.rideId) }, true);
			dispatch(userActions.updateUserDetails(transformedDriverActiveRides));
			dispatch(ridesActions.addActiveRide(transformedValues));
			dispatch(httpActions.requestSuccess());
			history.push(MY_PROFILE.path);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const removePassengerRide = (rideId, userId, history) => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			await Promise.all([
				updateFB('/users', userId, { activeRides: arrayRemove(rideId) }, true),
				updateFB('/users', userId, { ridesHistory: arrayUnion(rideId) }, true),
				updateFB('/rides', rideId, { passengers: arrayRemove(userId) }, true)
			]);

			dispatch(userActions.removeActiveRide(rideId));
			dispatch(userActions.addRideToHistory(rideId));
			dispatch(httpActions.requestSuccess());

			history.push(ACTIVE_RIDES.path);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	}
}

export const bookRide = (passenger, ride) => {
	const transformedPassengerActiveRides = { activeRides: [...passenger.activeRides, ride.rideId] };

	return async dispatch => {
		dispatch(httpActions.requestSend);
		try {
			await updateFB('/rides', ride.rideId, { passengers: arrayUnion(passenger.userId) }, true);
			await updateFB('/users', passenger.userId, { activeRides: arrayUnion(ride.rideId) }, true);
			dispatch(userActions.updateUserDetails(transformedPassengerActiveRides));
			dispatch(ridesActions.addActiveRide(ride));
			dispatch(httpActions.requestSuccess());
			// history.push(BOOKINGS.path);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const getUserActiveRides = userActiveRides => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			const ridesResponse = await Promise.all(userActiveRides.map(ride => getFB('/rides', { rideId: ride }, ['rideId'])));
			const spreadRidesResponse = ridesResponse.map(ride => ride[0]);
			const driversResponse = await Promise.all(spreadRidesResponse.map(driver => getFB('/users', { userId: driver.driverId }, ['userId'])));			
			const updatedRides = addDriverToRide(spreadRidesResponse, driversResponse);

			dispatch(ridesActions.populateActiveRides(updatedRides));
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const getFilteredRides = searchPreferences => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			const uniqueDriverIds = [];
			// TODO: make additional conditional filters for less important aspects
			const ridesResponse = await getFB('/rides', searchPreferences, ['destination', 'origin', 'rideType', 'smoking']);

			for (const ride of ridesResponse) {
				if (uniqueDriverIds.indexOf(ride.driverId) === -1) {
					uniqueDriverIds.push(ride.driverId);
				}
			}

			const driversResponse = await Promise.all(uniqueDriverIds.map(driver => getFB('/users', { userId: driver }, ['userId'])));
			const updatedRides = addDriverToRide(ridesResponse, driversResponse);

			dispatch(ridesActions.populateFilteredRides(updatedRides));
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};
