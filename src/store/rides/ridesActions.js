import { v4 as uuidv4 } from 'uuid';

import { userActions } from '../user/userSlice';
import { ridesActions } from './ridesSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE, ACTIVE_RIDES } from '../../utilities/constants/routes';
import { DRIVER, PASSENGER } from '../../utilities/constants/users';
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
			await Promise.all([
				addFBWithId('/rides', transformedValues, transformedValues.rideId),
				updateFB('/users', driver.userId, { activeRides: arrayUnion(transformedValues.rideId) }, true)
			]);

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

export const removePassengerRide = (ride, userDetails, history) => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			const comboRemoveRideCall = [
				updateFB('/users', userDetails.userId, { activeRides: arrayRemove(ride.rideId) }),
				updateFB('/users', userDetails.userId, { historyRides: arrayUnion(ride.rideId) })
			];

			if(userDetails.userType === PASSENGER) {
				comboRemoveRideCall.push(updateFB('/rides', ride.rideId, { passengers: arrayRemove(userDetails.userId) }));
			}

			if(userDetails.userType === DRIVER) {
				comboRemoveRideCall.push(updateFB('/rides', ride.rideId, { status: 'canceled' }));

				ride.passengers.forEach(passengerId => {
					comboRemoveRideCall.push(updateFB('/users', passengerId, { activeRides: arrayRemove(ride.rideId) }));
					comboRemoveRideCall.push(updateFB('/users', passengerId, { historyRides: arrayUnion(ride.rideId) }));
				})
			}

			await Promise.all(comboRemoveRideCall);

			dispatch(userActions.removeActiveRide(ride.rideId));
			dispatch(userActions.addHistoryRide(ride.rideId));
			dispatch(ridesActions.removeActiveRide(ride.rideId));
			dispatch(ridesActions.addHistoryRide(ride));
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
			await Promise.all([
				updateFB('/rides', ride.rideId, { passengers: arrayUnion(passenger.userId) }, true),
				updateFB('/users', passenger.userId, { activeRides: arrayUnion(ride.rideId) }, true)
			])

			dispatch(userActions.updateUserDetails(transformedPassengerActiveRides));
			dispatch(ridesActions.addActiveRide(ride));
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const getRidesState = (userRides, ridesMethod) => {
	// first arg -> ride data
	// second arg -> which ride method to be used (active or history)
	return async dispatch => {
		dispatch(httpActions.requestSend);
		
		try {
			const ridesResponse = await Promise.all(userRides.map(ride => getFB('/rides', { rideId: ride }, ['rideId'])));
			const spreadRidesResponse = ridesResponse.map(ride => ride[0]);
			const activeDriversResponse = await Promise.all(spreadRidesResponse.map(driver => getFB('/users', { userId: driver.driverId }, ['userId'])));			
			const updatedRides = addDriverToRide(spreadRidesResponse, activeDriversResponse);

			dispatch(ridesActions[ridesMethod](updatedRides));
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

export const addPassengersDetailsToActiveRides = users => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			const comboUsersCall = users.map(userId => getFB(`/users`, { userId }, ['userId']));
			const usersDetails = await Promise.all(comboUsersCall);
			const usersSpread = usersDetails.map(user => user[0]);
			
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	}
}