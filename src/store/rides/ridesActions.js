import { ridesActions } from './ridesSlice';
import { httpActions } from '../http/httpSlice';
import { getFB, addFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE } from '../../utilities/constants/routes'

const transformRideValues = (driverId, values) => {
	const newRideId = Math.random().toString(16).slice(2) + '_' + Date.now();
	const creationDate = new Date().toUTCString();
	const departureDateParsed = values.departureDate.toUTCString();

	return { ...values, departureDate: departureDateParsed, rideId: newRideId, driverId, passengers: [], creationDate };
};

export const addNewRide = (driverId, values, history) => {
	const transformedValues = transformRideValues(driverId, values);
  
	return async dispatch => {
		dispatch(httpActions.requestSend);
		try {
			await addFB('/rides', transformedValues)
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