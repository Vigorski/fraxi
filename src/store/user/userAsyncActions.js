import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { httpActions } from '../http/httpSlice';
import { errorActions } from '../errors/errorSlice';
import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { uploadImage, getFileUrl } from '../../utilities/api/firebase-storage-api';
import { PASSENGER } from '../../utilities/constants/users';

const transformUserUpdateValues = values => {
	const { email, userType, ...filteredValues } = values;

	if (values.password.length === 0) {
		delete filteredValues.password;
		delete filteredValues.confirmPassword;
	}

	return { ...filteredValues };
};

const transformUserRegisterValues = values => {
	const { confirmPassword, ...filteredValues } = values;
	const additionalValues = {
		userId: uuidv4(),
		historyRides: [],
		activeRides: [],
	};

	if (values.userType === PASSENGER) {
		additionalValues.ridePreferences = {};
	}

	return { ...filteredValues, ...additionalValues };
};

const transformUserLoginValues = values => {
	const { password, ...transformedValues } = values;

	return transformedValues;
};

// TODO: finish image for register
export const userRegister = createAsyncThunk('user/userRegister', async ({ values }, { dispatch }) => {
	dispatch(httpActions.requestSend());
	const transformedValues = transformUserRegisterValues(values);

	try {
		const registerResponse = await addFBWithId('/users', transformedValues, transformedValues.userId);
		dispatch(httpActions.requestSuccess());

		return registerResponse;
	} catch (err) {
		console.log(err);
		dispatch(
			httpActions.requestError({
				errorMessage: err.message || 'Something went wrong!',
			})
		);
	}
});

export const userUpdate = createAsyncThunk('user/userUpdate', async ({ userId, values }, { dispatch }) => {
	dispatch(httpActions.requestSend());
	const { profilePicture, ...transformedValues } = transformUserUpdateValues(values);
	const profilePictureExists = profilePicture !== undefined && profilePicture !== '';

	try {
		if ( profilePictureExists ) {
			await uploadImage(
				`images/users/userAvatar__${userId}`,
				profilePicture,
				{contentType: profilePicture.type}
			);

			const imageRealLocation = await getFileUrl(`images/users/userAvatar__${userId}`)
			transformedValues.profilePicture = imageRealLocation;
		}

		await updateFB('/users', userId, transformedValues);

		dispatch(httpActions.requestSuccess());

		return transformedValues;
	} catch (err) {
		console.log(err);
		dispatch(
			httpActions.requestError({
				errorMessage: err.message || 'Something went wrong!',
			})
		);
	}
});

export const userLogin = createAsyncThunk('user/userLogin', async ({ values }, { dispatch }) => {
	dispatch(httpActions.requestSend());
	dispatch(errorActions.setGlobalFormError({ errorMessage: '' }));

	try {
		const responseData = await getFB(`/users`, values, ['email', 'password']);

		if (responseData.length > 0) {
			const transformedValues = transformUserLoginValues(responseData[0]);

			dispatch(httpActions.requestSuccess(transformedValues));
			localStorage.setItem('loggedUser', JSON.stringify(transformedValues.userId));

			return {
				isLoggedIn: true,
				user: transformedValues,
			};
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
});

export const userRelogin = createAsyncThunk('user/userRelogin', async (userId, { dispatch }) => {
	dispatch(httpActions.requestSend());

	try {
		const responseData = await getFB(`/users`, { userId }, ['userId']);

		if (responseData.length > 0) {
			const transformedValues = transformUserLoginValues(responseData[0]);
			dispatch(httpActions.requestSuccess(transformedValues));

			return {
				isLoggedIn: true,
				user: transformedValues,
			};
		} else {
			dispatch(
				httpActions.requestError({
					errorMessage: 'We were unable to log you in.',
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
});

export const updateRidePreferences = createAsyncThunk('user/updateRidePreferences', async ({ userId, values }, { dispatch }) => {
	dispatch(httpActions.requestSend());

	try {
		// const updateRes =
		await updateFB('/users', userId, { ridePreferences: values });
		dispatch(httpActions.requestSuccess());

		return values;
	} catch (err) {
		console.log(err);
		dispatch(
			httpActions.requestError({
				errorMessage: err.message || 'Something went wrong!',
			})
		);
	}
});
