import { createAsyncThunk } from '@reduxjs/toolkit';
import { arrayRemove, arrayUnion, where } from 'firebase/firestore';
import { httpActions } from 'store/http/httpSlice';
import { userActions } from 'store/user/userSlice';
import { ridesActions } from 'store/rides/ridesSlice';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import FirebaseStorageService from 'services/FirebaseStorageService';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { USER_TYPES } from 'utilities/constants/userTypes';

const excludeCorePropsFromUserDetails = values => {
  const { email, userType, password, confirmPassword, ...filteredValues } =
    values;

  return filteredValues;
};

const prepareUserRegisterValues = values => {
  const { password, confirmPassword, ...filteredValues } = values;
  const additionalValues = {
    historyRides: [],
    activeRides: [],
    savedDrivers: [],
  };

  if (values.userType === USER_TYPES.passenger) {
    additionalValues.ridePreferences = {};
  }

  return { ...filteredValues, ...additionalValues };
};

const handleUserPictureUpload = async (profilePicture, userId) => {
  if (!profilePicture) return '';

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
    dispatch(userActions.setIsRegistering(true));
    dispatch(httpActions.requestSend());

    try {
      const authUser = await FirebaseAuthService.registerWithEmail(
        values.email,
        values.password,
      );

      const profilePictureUrl = await handleUserPictureUpload(
        values.profilePicture,
        authUser.uid,
      );

      const userData = prepareUserRegisterValues({
        ...values,
        userId: authUser.uid,
        profilePicture: profilePictureUrl,
      });

      await FirebaseFirestoreService.add('/users', userData.userId, userData);

      dispatch(httpActions.requestSuccess('Succesfully created new user.'));
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Unable to create new user.'),
      );
    } finally {
      dispatch(userActions.setIsRegistering(false));
    }
  },
);

export const userUpdate = createAsyncThunk(
  'user/userUpdate',
  async ({ userId, values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const { profilePicture, ...userData } =
        excludeCorePropsFromUserDetails(values);

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

// google login has to be a two-part chain when user has not been registered yet
// first part is login and preparing for optional register
export const handleUserLoginWithGoogleAuth = createAsyncThunk(
  'user/handleUserLoginWithGoogleAuth',
  async (_, { dispatch }) => {
    dispatch(userActions.setIsRegistering(true));
    dispatch(httpActions.requestSend());

    try {
      const user = await FirebaseAuthService.loginWithGoogle();
      const userFound = await FirebaseFirestoreService.get('/users', [
        where('userId', '==', user.uid),
      ]);
      const isUserRegistered = userFound?.length > 0;

      if (isUserRegistered) {
        dispatch(userActions.setIsRegistering(false));
      }

      dispatch(httpActions.requestSuccess());

      return isUserRegistered;
    } catch (err) {
      await FirebaseAuthService.signOut();
      console.error(err);
      dispatch(
        httpActions.requestError(
          err.message || 'Cannot login with google account!',
        ),
      );
    }
  },
);

export const userRegisterWithGoogleAuth = createAsyncThunk(
  'user/userRegisterWithGoogleAuth',
  async ({ values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const user = FirebaseAuthService.getCurrentUser();
      let profilePicture;

      if (values.profilePicture) {
        profilePicture = await handleUserPictureUpload(
          values.profilePicture,
          user.uid,
        );
      } else {
        profilePicture = user.photoURL;
      }

      const userData = prepareUserRegisterValues({
        ...values,
        userId: user.uid,
        email: user.email,
        profilePicture,
      });

      await FirebaseFirestoreService.add('/users', userData.userId, userData);

      dispatch(
        httpActions.requestSuccess('Succesfully created new user via Google.'),
      );
    } catch (err) {
      await FirebaseAuthService.signOut();

      console.error(err);
      dispatch(
        httpActions.requestError(
          err.message || 'Cannot register with google account!',
        ),
      );
    } finally {
      dispatch(userActions.setIsRegistering(false));
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

      if (!responseData.length) {
        throw new Error('Unable to retrieve user data!');
      }

      dispatch(httpActions.requestSuccess());

      return {
        isLoggedIn: true,
        isAuthStateDetermined: true,
        user: responseData[0],
      };
    } catch (err) {
      await FirebaseAuthService.signOut();
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

export const userLogout = createAsyncThunk(
  'user/userLogout',
  async (_, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseAuthService.signOut();
      dispatch(userActions.removeLoggedUser());
      dispatch(ridesActions.resetRides());
      dispatch(httpActions.requestSuccess('Signed out successfully'));
    } catch (err) {
      console.error(err.message);
      dispatch(
        httpActions.requestError(err.message || 'Error while signing out.'),
      );
    }
  },
);

export const saveDriver = createAsyncThunk(
  'user/saveDriver',
  async ({ userDetails, driverId }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    const isDriverAlreadySaved = userDetails.savedDrivers.find(
      driver => driver === driverId,
    );

    try {
      if (isDriverAlreadySaved) {
        throw new Error('Driver has already been saved');
      }

      await FirebaseFirestoreService.update('/users', userDetails.userId, {
        savedDrivers: arrayUnion(driverId),
      });

      dispatch(httpActions.requestSuccess('Driver saved.'));
      return driverId;
    } catch (err) {
      console.error(err.message);
      dispatch(
        httpActions.requestError(err.message || 'Error when saving driver.'),
      );
    }
  },
);

export const unsaveDriver = createAsyncThunk(
  'user/unsaveDriver',
  async ({ userDetails, driverId }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseFirestoreService.update('/users', userDetails.userId, {
        savedDrivers: arrayRemove(driverId),
      });

      dispatch(httpActions.requestSuccess('Driver removed.'));
      return driverId;
    } catch (err) {
      console.error(err.message);
      dispatch(
        httpActions.requestError(err.message || 'Error when removing driver.'),
      );
    }
  },
);

export const fetchMultipleDrivers = createAsyncThunk(
  'user/fetchMultipleDrivers',
  async ({ driversIds }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const driversResponse = await Promise.all(
        driversIds.map(driverId =>
          FirebaseFirestoreService.get('/users', [
            where('userId', '==', driverId),
          ]),
        ),
      );

      if (!driversResponse.length) {
        throw new Error('Unable to retrieve drivers!');
      }

      const flatenedDriversResponse = driversResponse.map(driver => driver[0]);

      dispatch(httpActions.requestSuccess());
      return flatenedDriversResponse;
    } catch (err) {
      console.error(err.message);
      dispatch(
        httpActions.requestError(err.message || 'Error fetching drivers.'),
      );
    }
  },
);
