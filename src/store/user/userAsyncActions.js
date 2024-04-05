import { createAsyncThunk } from '@reduxjs/toolkit';
import { where } from 'firebase/firestore';
import { httpActions } from 'store/http/httpSlice';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import FirebaseStorageService from 'services/FirebaseStorageService';
import { PASSENGER } from 'utilities/constants/users';
import FirebaseAuthService from 'services/FirebaseAuthService';

const transformUserUpdateValues = values => {
  const { email, userType, password, confirmPassword, ...filteredValues } = values;

  return filteredValues;
};

const transformUserRegisterValues = values => {
  const { password, confirmPassword, ...filteredValues } = values;
  const additionalValues = {
    historyRides: [],
    activeRides: [],
  };

  if (values.userType === PASSENGER) {
    additionalValues.ridePreferences = {};
  }

  return { ...filteredValues, ...additionalValues };
};

const handleUserPictureUpload = async (profilePicture, userId) => {
  if (!profilePicture) return null;
  
  const url = `images/users/userAvatar__${userId}`;

  try {
    await FirebaseStorageService.uploadImage(url, profilePicture, {
      contentType: profilePicture.type,
    });
    const imageRealLocation = await FirebaseStorageService.getFileUrl(url);
    return imageRealLocation;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const userRegister = createAsyncThunk(
  'user/userRegister',
  async ({ values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const authUser = await FirebaseAuthService.registerWithEmail(
        values.email,
        values.password,
      );

      const { profilePicture, ...userData } = transformUserRegisterValues({
        ...values,
        userId: authUser.uid,
      });

      const profilePictureUrl = await handleUserPictureUpload(
        profilePicture,
        userData.userId,
      );

      if (profilePictureUrl) {
        userData.profilePicture = profilePictureUrl;
      }

      await FirebaseFirestoreService.add(
        '/users',
        userData.userId,
        userData,
      );

      dispatch(httpActions.requestSuccess('Succesfully created new user.'));
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Unable to create new user.'),
      );
    }
  },
);

export const userUpdate = createAsyncThunk(
  'user/userUpdate',
  async ({ userId, values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    const { profilePicture, ...userData } = transformUserUpdateValues(values);

    try {
      const profilePictureUrl = await handleUserPictureUpload(
        profilePicture,
        userId,
      );

      if (profilePictureUrl) {
        userData.profilePicture = profilePictureUrl;
      }

      if (values.password.length !== 0) {
        await FirebaseAuthService.updatePassword(userData.password);
      }

      await FirebaseFirestoreService.update('/users', userId, userData);

      dispatch(httpActions.requestSuccess('Updated user details.'));

      return userData;
    } catch (err) {
      console.log(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);

export const userLogin = createAsyncThunk(
  'user/userLogin',
  async ({ values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseAuthService.loginWithEmail(values.email, values.password);
      dispatch(httpActions.requestSuccess());
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Unable to login user.'),
      );
    }
  },
);

export const getAndStoreUserData = createAsyncThunk(
  'user/getAndStoreUserData',
  async (userId, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const responseData = await FirebaseFirestoreService.get('/users', [
        where('userId', '==', userId),
      ]);

      dispatch(httpActions.requestSuccess());

      return {
        isLoggedIn: true,
        user: responseData[0],
      };
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);

export const updateRidePreferences = createAsyncThunk(
  'user/updateRidePreferences',
  async ({ userId, values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseFirestoreService.update('/users', userId, {
        ridePreferences: values,
      });
      dispatch(httpActions.requestSuccess("Updated user's ride preferences."));

      return values;
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(
          err.message || 'Unable to update ride preferences.',
        ),
      );
    }
  },
);
