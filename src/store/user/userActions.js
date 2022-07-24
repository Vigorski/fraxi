import { userActions } from './userSlice';
import { httpActions } from '../http/httpSlice';
import { errorActions } from '../errors/errorSlice';
import { patchRequest, getRequest, getFB, addFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE, LOGIN } from '../../utilities/constants/routes';
import { PASSENGER } from '../../utilities/constants/users';

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
	const { confirmPassword, ...filteredValues } = values;
	const additionalValues = {
		userId: newId,
		ridesHistory: [],
		activeRides: [],
	};

	if(values.userType === PASSENGER) {
		additionalValues.routePreferences = {}
	}

	return { ...filteredValues, ...additionalValues };
};

export const userRegister = (values, history) => {
	const transformedValues = transformUserRegisterValues(values);

	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			await addFB('/users', transformedValues);
			dispatch(httpActions.requestSuccess());
			history.push(LOGIN);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const userLogin = (credentials, history) => {
	return async dispatch => {
		dispatch(httpActions.requestSend);
		dispatch(errorActions.setGlobalFormError({ errorMessage: '' }));

		try {
			const responseData = await getFB(`/users`, credentials, ['email', 'password']);

			if (responseData.length > 0) {
				const transformedValues = transformUserLoginValues(responseData);

				dispatch(
					userActions.addLoggedInUser({
						isLoggedIn: true,
						user: transformedValues,
					})
				);

				dispatch(httpActions.requestSuccess(transformedValues));
				localStorage.setItem('loggedUser', JSON.stringify(transformedValues.userId));
				history.push(MY_PROFILE);
			} else {
				dispatch(errorActions.setGlobalFormError({ errorMessage: 'Wrong email or password!' }));
			}
		} catch (err) {
			console.log(err);
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
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};

export const userLogout = history => {
	return dispatch => {
		dispatch(userActions.removeLoggedUser());
		localStorage.removeItem('loggedUser');
		history.push(LOGIN);
	};
};

export const updateRoutePreferences = (userId, values, history) => {
	return async dispatch => {
		dispatch(httpActions.requestSend);

		try {
			await patchRequest(`users/${userId}`, 'routePreferences', values);
			dispatch(userActions.updateRoutePreferences(values));
			dispatch(httpActions.requestSuccess());
			history.push(MY_PROFILE);
		} catch (err) {
			console.log(err);
			dispatch(httpActions.requestError({ errorMessage: err.message || 'Something went wrong!' }));
		}
	};
};
