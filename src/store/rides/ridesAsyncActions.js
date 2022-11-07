import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { arrayUnion, arrayRemove } from 'firebase/firestore';

import { userActions } from '../user/userSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { DRIVER, PASSENGER } from '../../utilities/constants/users';
import { MKD_CITIES_ABBREVIATED } from '../../utilities/constants/cities';

const cityAbbr = Object.keys(MKD_CITIES_ABBREVIATED);
const citiesFull = Object.values(MKD_CITIES_ABBREVIATED);

const transformRideValues = (driverId, route, values) => {
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
    route,
		status: 'active',
		originAbbr: cityAbbr[indexOfOrigin],
		destinationAbbr: cityAbbr[indexOfDestination],
	};
};

const addDriverToRide = (rides, drivers) => {
	const updatedRides = rides.map(ride => {
		// using the first index of the response since it always returns an array which will only have a single item
		const driverDetails = drivers.find(driver => driver[0].userId === ride.driverId);
		return { ...ride, driverDetails: driverDetails[0] };
	});

	return updatedRides;
}

export const addNewRide = createAsyncThunk('rides/addNewRide', async ({ driver, route, values }, { dispatch }) => {
  dispatch(httpActions.requestSend());
  
  try {
    const transformedValues = transformRideValues(driver.userId, route, values);
    const transformedDriverActiveRides = { activeRides: [...driver.activeRides, transformedValues.rideId] };

    await Promise.all([
      addFBWithId('/rides', transformedValues, transformedValues.rideId),
      updateFB('/users', driver.userId, { activeRides: arrayUnion(transformedValues.rideId) }, true)
    ]);

    dispatch(userActions.updateUserDetails(transformedDriverActiveRides));
    dispatch(httpActions.requestSuccess('New ride created.'));

    return transformedValues;
  } catch (err) {
    console.log(err);
    dispatch(httpActions.requestError(err.message || 'Something went wrong!'));
  }
});

export const bookRide = createAsyncThunk('rides/bookRide', async ({ passenger, rideDetails }, { dispatch }) => {
  dispatch(httpActions.requestSend());
  
  try {
    if (rideDetails.passengers.length === rideDetails.maxPassengers) {
      throw new Error('Ride reached max passengers!');
    }

    const transformedPassengerActiveRides = { activeRides: [...passenger.activeRides, rideDetails.rideId] };
    await Promise.all([
      updateFB('/rides', rideDetails.rideId, { passengers: arrayUnion(passenger.userId) }, true),
      updateFB('/users', passenger.userId, { activeRides: arrayUnion(rideDetails.rideId) }, true)
    ]);

    dispatch(userActions.updateUserDetails(transformedPassengerActiveRides));
    dispatch(httpActions.requestSuccess('Ride booked.'));

    return rideDetails;
  } catch (err) {
    console.log(err);
    dispatch(httpActions.requestError(err.message || 'Something went wrong!'));
  }
});

export const removePassengerRide = createAsyncThunk('rides/removePassengerRide', async ({ rideDetails, userDetails }, { dispatch }) => {
  dispatch(httpActions.requestSend());

  try {
    const comboRemoveRideCall = [
      updateFB('/users', userDetails.userId, { activeRides: arrayRemove(rideDetails.rideId) }),
      updateFB('/users', userDetails.userId, { historyRides: arrayUnion(rideDetails.rideId) })
    ];

    if(userDetails.userType === PASSENGER) {
      comboRemoveRideCall.push(updateFB('/rides', rideDetails.rideId, { passengers: arrayRemove(userDetails.userId) }));
    }

    if(userDetails.userType === DRIVER) {
      comboRemoveRideCall.push(updateFB('/rides', rideDetails.rideId, { status: 'canceled' }));

      rideDetails.passengers.forEach(passengerId => {
        comboRemoveRideCall.push(updateFB('/users', passengerId, { activeRides: arrayRemove(rideDetails.rideId) }));
        comboRemoveRideCall.push(updateFB('/users', passengerId, { historyRides: arrayUnion(rideDetails.rideId) }));
      })
    }

    await Promise.all(comboRemoveRideCall);

    dispatch(userActions.removeActiveRide(rideDetails.rideId));
    dispatch(userActions.addHistoryRide(rideDetails.rideId));
    dispatch(httpActions.requestSuccess('Ride successfully canceled.'));
    
    return rideDetails;
  } catch (err) {
    console.log(err);
    dispatch(httpActions.requestError(err.message || 'Something went wrong!'));
  }	
});

// TODO: perhaps populate history state at the same time?
export const getRidesState = createAsyncThunk('rides/getRidesState', async ({ userRides, ridesMethod }, { dispatch }) => {
	// first arg -> ride data
	// second arg -> which ride method to be used (active or history)
  dispatch(httpActions.requestSend());
  
  try {
    const ridesResponse = await Promise.all(userRides.map(ride => getFB('/rides', { rideId: ride }, ['rideId'])));
    const spreadRidesResponse = ridesResponse.map(ride => ride[0]);
    const activeDriversResponse = await Promise.all(spreadRidesResponse.map(driver => getFB('/users', { userId: driver.driverId }, ['userId'])));			
    const updatedRides = addDriverToRide(spreadRidesResponse, activeDriversResponse);

    dispatch(httpActions.requestSuccess());
    return { ridesMethod, updatedRides };
  } catch (err) {
    console.log(err);
    dispatch(httpActions.requestError(err.message || 'Something went wrong!'));
  }
});

export const getFilteredRides = createAsyncThunk('rides/getFilteredRides', async ({ searchPreferences }, { dispatch }) => {
  dispatch(httpActions.requestSend());

  try {
    const uniqueDriverIds = [];
    // TODO: make additional conditional filters for less important aspects
    // TODO: if too few results, remove some filters
    const ridesResponse = await getFB('/rides', searchPreferences, ['destination', 'origin', 'rideType', 'smoking']);

    for (const ride of ridesResponse) {
      if (uniqueDriverIds.indexOf(ride.driverId) === -1) {
        uniqueDriverIds.push(ride.driverId);
      }
    }

    const driversResponse = await Promise.all(uniqueDriverIds.map(driver => getFB('/users', { userId: driver }, ['userId'])));
    const updatedRides = addDriverToRide(ridesResponse, driversResponse);

    dispatch(httpActions.requestSuccess());
    return updatedRides;
  } catch (err) {
    console.log(err);
    dispatch(httpActions.requestError(err.message || 'Something went wrong!'));
  }
});