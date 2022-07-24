import { ridesActions } from './ridesSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE } from '../../utilities/constants/routes'
import { arrayUnion } from 'firebase/firestore';

const transformRideValues = (driverId, values) => {
	const newRideId = 'ride_' + Math.random().toString(16).slice(2) + '_' + Date.now();
	const creationDate = new Date().toUTCString();
	const departureDateParsed = values.departureDate.toUTCString();

	return { ...values, departureDate: departureDateParsed, rideId: newRideId, driverId, passengers: [], creationDate, status: 'active' };
};

export const addNewRide = (driverId, values, history) => {
	const transformedValues = transformRideValues(driverId, values);
  
	return async dispatch => {
		dispatch(httpActions.requestSend);
		try {
			await addFBWithId('/rides', transformedValues, transformedValues.rideId);
			await updateFB('/users', driverId, {activeRides: arrayUnion(transformedValues.rideId)}, true)
			dispatch(httpActions.requestSuccess());
			dispatch(ridesActions.addRide(transformedValues));
			history.push(MY_PROFILE);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const getUserRideHistory = (driverId) => {
  return async dispatch => {
		await getFB('/rides', driverId);
    // let responseData = null;
    // dispatch(httpActions.requestSend);

    // try {
		// 	responseData = await getRequest(`/rides`);

    //   dispatch(httpActions.requestSuccess());
		// } catch (err) {
		// 	console.log(err)
		// 	dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		// }
  }
}