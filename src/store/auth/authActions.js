import { authActions } from './authSlice';
import { httpActions } from '../http/httpSlice';
import { errorActions } from '../errors/errorSlice';
import { makeRequest } from '../../utilities/api';
import { FIREBASE_DB } from '../../utilities/constants/db';

const validateUser = (allUsers, values) => {
	const found = Object.values(allUsers).find(item => item.email === values.email && item.password === values.password);
	return found;
};

const transformUserLoginValues = (values) => {
  const { password, ...transformedValues } = values;

	return transformedValues;
}

const transformUserRegisterValues = values => {
	const newId = Math.random().toString(16).slice(2) + '_' + Date.now();
	const { confirmPassword, ...transformedValues } = values;

	return { ...transformedValues, userId: newId, routeHistory: [] };
};

export const userLogin = credentials => {
	const requestDetails = { url: `${FIREBASE_DB}/users.json` };

	return async dispatch => {
		let responseData = null;
		dispatch(httpActions.requestSend);
		dispatch(errorActions.setGlobalFormError({ errorMessage: '' }));

		try {
			responseData = await makeRequest(requestDetails);
			const areCredsValid = validateUser(responseData, credentials);
      
			if (areCredsValid !== undefined) {
        const transformedValues = transformUserLoginValues(areCredsValid);
        
				dispatch(
					authActions.addLoggedInUser({
						isLoggedIn: true,
						user: transformedValues,
					})
        );

        dispatch(httpActions.requestSuccess(transformedValues));
			} else {
				dispatch(errorActions.setGlobalFormError({ errorMessage: 'Wrong email or password!' }));
			}
		} catch (err) {
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const userRegister = values => {
	const requestDetails = {
		url: `${FIREBASE_DB}/users.json`,
		method: 'POST',
		body: transformUserRegisterValues(values),
		headers: { 'Content-Type': 'application/json' },
	};

	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			await makeRequest(requestDetails);
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};
