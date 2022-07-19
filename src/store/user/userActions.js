import { userActions } from './userSlice';
import { httpActions } from '../http/httpSlice';
import { errorActions } from '../errors/errorSlice';
import { postRequest, patchRequest, getRequest } from '../../utilities/api/firebase-api';

const validateUser = (allUsers, values, userId = null) => {
	if (userId) {
		return Object.values(allUsers).find(item => item.userId === userId);
	}
	
	return Object.values(allUsers).find(item => item.email === values.email && item.password === values.password);
};

const transformUserLoginValues = values => {
	const { password, ...transformedValues } = values;

	return transformedValues;
};

const transformUserRegisterValues = values => {
	const newId = Math.random().toString(16).slice(2) + '_' + Date.now();
	const { confirmPassword, ...transformedValues } = values;

	return { ...transformedValues, userId: newId, routeHistory: [], routePreferences: {} };
};

export const userRegister = values => {
	const transformedValues = transformUserRegisterValues(values);

	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			await postRequest(`users/${transformedValues.userId}`, transformedValues);
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const userLogin = credentials => {
	return async dispatch => {
		let responseData = null;
		dispatch(httpActions.requestSend);
		dispatch(errorActions.setGlobalFormError({ errorMessage: '' }));

		try {
			responseData = await getRequest(`/users`);
			const areCredsValid = validateUser(responseData, credentials);

			if (areCredsValid !== undefined) {
				const transformedValues = transformUserLoginValues(areCredsValid);

				dispatch(
					userActions.addLoggedInUser({
						isLoggedIn: true,
						user: transformedValues,
					})
				);

				dispatch(httpActions.requestSuccess(transformedValues));
				localStorage.setItem('loggedUser', JSON.stringify(transformedValues.userId));
			} else {
				dispatch(errorActions.setGlobalFormError({ errorMessage: 'Wrong email or password!' }));
			}
		} catch (err) {
			console.log(err)
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const userRelogin = userId => {
	return async dispatch => {
		let responseData = null;
		dispatch(httpActions.requestSend);

		try {
			responseData = await getRequest(`/users`);
			const areCredsValid = validateUser(responseData, null, userId);

			if (areCredsValid !== undefined) {
				const transformedValues = transformUserLoginValues(areCredsValid);

				dispatch(
					userActions.addLoggedInUser({
						isLoggedIn: true,
						user: transformedValues,
					})
				);

				dispatch(httpActions.requestSuccess(transformedValues));
			} else {
				dispatch(httpActions.requestError({ errorMessage: 'We were unable to fetch a logged user!' }));
			}
		} catch (err) {
			console.log(err)
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const userLogout = () => {
	return dispatch => {
		dispatch(userActions.removeLoggedUser());
		localStorage.removeItem('loggedUser');
	}
}

export const updateRoutePreferences = (userId, values) => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			await patchRequest(`users/${userId}`, 'routePreferences', values);
			dispatch(userActions.updateRoutePreferences(values));
			dispatch(httpActions.requestSuccess());
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};
