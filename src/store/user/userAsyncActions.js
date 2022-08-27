// import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';

// import { userActions } from './userSlice';
// import { ridesActions } from '../rides/ridesSlice';
import { httpActions } from '../http/httpSlice';
// import { errorActions } from '../errors/errorSlice';
// import { getFB, addFBWithId, updateFB } from '../../utilities/api/firebase-api';
import { updateFB } from '../../utilities/api/firebase-api';
// import { MY_PROFILE, LOGIN } from '../../utilities/constants/routes';
import { MY_PROFILE } from '../../utilities/constants/routes';
// import { PASSENGER } from '../../utilities/constants/users';

const transformUserUpdateValues = (values) => {
	const { email, userType, ...filteredValues } = values;

	if (values.password.length === 0) {
		delete filteredValues.password;
		delete filteredValues.confirmPassword;
	}

	return { ...filteredValues };
};

export const userUpdate = createAsyncThunk(
	'user/userUpdate',
	async ({userId, values, history}, {dispatch}) => {
		const transformedValues = transformUserUpdateValues(values);

		dispatch(httpActions.requestSend());

		try {
			await updateFB('/users', userId, transformedValues);
			dispatch(httpActions.requestSuccess());
			history.push(MY_PROFILE.path);
			return transformedValues;
		} catch (err) {
			console.log(err);
			dispatch(
				httpActions.requestError({
					errorMessage: err.message || 'Something went wrong!',
				})
			);
		}
	}
);