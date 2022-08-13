import { v4 as uuidv4 } from 'uuid';

import { userActions } from './userSlice';
import { ridesActions } from '../rides/ridesSlice';
import { httpActions } from '../http/httpSlice';
import { errorActions } from '../errors/errorSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { MY_PROFILE, LOGIN } from '../../utilities/constants/routes';
import { PASSENGER } from '../../utilities/constants/users';

const transformUserLoginValues = (values) => {
	const { password, ...transformedValues } = values;

	return transformedValues;
};

const transformUserRegisterValues = (values) => {
	const { confirmPassword, ...filteredValues } = values;
	const additionalValues = {
		userId: uuidv4(),
		ridesHistory: [],
		activeRides: []
	};

	if (values.userType === PASSENGER) {
		additionalValues.ridePreferences = {};
	}

	return { ...filteredValues, ...additionalValues };
};

const transformUserUpdateValues = (values) => {
	const { email, userType, ...filteredValues } = values;

	if (values.password.length === 0) {
		delete filteredValues.password;
		delete filteredValues.confirmPassword;
	}

	return { ...filteredValues };
};

export const userRegister = (values, history) => {
	const transformedValues = transformUserRegisterValues(values);

	return async (dispatch) => {
		dispatch(httpActions.requestSend);

		try {
			await addFBWithId('/users', transformedValues, transformedValues.userId);
			dispatch(httpActions.requestSuccess());
			history.push(LOGIN.path);
		} catch (err) {
			console.log(err);
			dispatch(
				httpActions.requestError({
					errorMessage: err.message || 'Something went wrong!',
				})
			);
		}
	};
};

export const userUpdate = (userId, values, history) => {
	const transformedValues = transformUserUpdateValues(values);

	return async (dispatch) => {
		dispatch(httpActions.requestSend);

		try {
			await updateFB('/users', userId, transformedValues);
			dispatch(userActions.updateUserDetails(transformedValues));
			dispatch(httpActions.requestSuccess());
			history.push(MY_PROFILE.path);
		} catch (err) {
			console.log(err);
			dispatch(
				httpActions.requestError({
					errorMessage: err.message || 'Something went wrong!',
				})
			);
		}
	};
};

export const userLogin = (credentials, history) => {
	return async (dispatch) => {
		dispatch(httpActions.requestSend);
		dispatch(errorActions.setGlobalFormError({ errorMessage: '' }));

		try {
			const responseData = await getFB(`/users`, credentials, [
				'email',
				'password',
			]);

			if (responseData.length > 0) {
				const transformedValues = transformUserLoginValues(responseData[0]);

				dispatch(
					userActions.addLoggedInUser({
						isLoggedIn: true,
						user: transformedValues,
					})
				);

				dispatch(httpActions.requestSuccess(transformedValues));
				localStorage.setItem(
					'loggedUser',
					JSON.stringify(transformedValues.userId)
				);
				history.push(MY_PROFILE.path);
			} else {
				dispatch(
					errorActions.setGlobalFormError({
						errorMessage: 'Wrong email or password!',
					})
				);
			}
		} catch (err) {
			console.log(err);
			dispatch(
				httpActions.requestError({
					errorMessage: err.message || 'Something went wrong!',
				})
			);
		}
	};
};

export const userRelogin = (userId) => {
	return async (dispatch) => {
		dispatch(httpActions.requestSend);

		try {
			const responseData = await getFB(`/users`, { userId }, ['userId']);

			if (responseData.length > 0) {
				const transformedValues = transformUserLoginValues(responseData[0]);

				dispatch(
					userActions.addLoggedInUser({
						isLoggedIn: true,
						user: transformedValues,
					})
				);

				dispatch(httpActions.requestSuccess(transformedValues));
			} else {
				dispatch(
					httpActions.requestError({
						errorMessage: 'We were unable to fetch a logged user!',
					})
				);
			}
		} catch (err) {
			console.log(err);
			dispatch(
				httpActions.requestError({
					errorMessage: err.message || 'Something went wrong!',
				})
			);
		}
	};
};

export const userLogout = (history) => {
	return (dispatch) => {
		dispatch(userActions.removeLoggedUser());
		dispatch(ridesActions.resetRides())
		localStorage.removeItem('loggedUser');
		history.push(LOGIN.path);
	};
};

export const updateRidePreferences = (userId, values, history) => {
	return async (dispatch) => {
		dispatch(httpActions.requestSend);

		try {
			await updateFB('/users', userId, { ridePreferences: values });
			dispatch(userActions.updateRidePreferences(values));
			dispatch(httpActions.requestSuccess());
			history.push(MY_PROFILE.path);
		} catch (err) {
			console.log(err);
			dispatch(
				httpActions.requestError({
					errorMessage: err.message || 'Something went wrong!',
				})
			);
		}
	};
};
