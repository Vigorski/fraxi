import { createAsyncThunk } from '@reduxjs/toolkit';
import { arrayRemove, arrayUnion, where } from 'firebase/firestore';
import { httpActions } from 'store/http/httpSlice';
import { userActions } from 'store/user/userSlice';
import { ridesActions } from 'store/rides/ridesSlice';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import FirebaseStorageService from 'services/FirebaseStorageService';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { USER_TYPES } from 'types/auth';
import {
  RidePreferences,
  User,
  UserExtras,
  UserForm,
  UserId,
} from 'types/user';
import { ActionError } from 'types/generalActions';
import {
  FetchUsersArgs,
  SaveDriverArgs,
  UpdateRidePreferencesArgs,
  UserLoginArgs,
  UserRegisterArgs,
  UserUpdateArgs,
  UserUpdateReturn,
} from 'types/userActions';
import { handleThunkError } from 'utilities/shared/handleThunkError';

const excludeCorePropsFromUserDetails = (values: UserForm) => {
  const { email, userType, password, confirmPassword, ...filteredValues } =
    values;

  return filteredValues;
};

const prepareUserRegisterValues = (
  values: UserForm<string> & UserId,
): Omit<User, 'id'> => {
  const { password, confirmPassword, ...filteredValues } = values;
  const additionalValues: UserExtras = {
    savedDrivers: [],
    historyRides: [],
    activeRides: [],
  };

  if (values.userType === USER_TYPES.passenger) {
    additionalValues.ridePreferences = {}; // #TODO: check if this empty object can be substituted by undefined
  }

  return { ...filteredValues, ...additionalValues };
};

const handleUserPictureUpload = async (
  userId: string,
  profilePicture?: File,
) => {
  if (!profilePicture) return '';

  const url = `images/users/userAvatar__${userId}`;

  try {
    await FirebaseStorageService.uploadImage(url, profilePicture);
    const imageRealLocation = await FirebaseStorageService.getFileUrl(url);
    return imageRealLocation;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const userRegister = createAsyncThunk<
  undefined,
  UserRegisterArgs,
  ActionError
>('user/userRegister', async ({ values }, { dispatch, rejectWithValue }) => {
  dispatch(userActions.setIsRegistering(true));
  dispatch(httpActions.requestSend());

  try {
    const authUser = await FirebaseAuthService.registerWithEmail(
      values.email,
      values.password,
    );

    const profilePictureUrl = await handleUserPictureUpload(
      authUser.uid,
      values.profilePicture,
    );

    const userData = prepareUserRegisterValues({
      ...values,
      userId: authUser.uid,
      profilePicture: profilePictureUrl,
    });

    await FirebaseFirestoreService.add('/users', userData.userId, userData);

    dispatch(httpActions.requestSuccess('Succesfully created new user.'));
  } catch (err: any) {
    return handleThunkError({
      err,
      defaultMessage: 'Unable to create new user.',
      dispatch,
      rejectWithValue,
    });
  } finally {
    dispatch(userActions.setIsRegistering(false));
  }
});

export const userUpdate = createAsyncThunk<
  UserUpdateReturn,
  UserUpdateArgs,
  ActionError
>(
  'user/userUpdate',
  async ({ userId, values }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      const { profilePicture, ...userDataExcludedCore } =
        excludeCorePropsFromUserDetails(values);
      const userData: UserUpdateReturn = { ...userDataExcludedCore };

      const profilePictureUrl = await handleUserPictureUpload(
        userId,
        profilePicture,
      );

      if (profilePictureUrl) {
        userData.profilePicture = profilePictureUrl;
      }

      if (values.password) {
        await FirebaseAuthService.updatePassword(values.password);
      }

      await FirebaseFirestoreService.update('/users', userId, userData);

      dispatch(httpActions.requestSuccess('Updated user details.'));

      return userData;
    } catch (err: any) {
      return handleThunkError({
        err,
        dispatch,
        rejectWithValue,
      });
    }
  },
);

export const userLogin = createAsyncThunk<
  undefined,
  UserLoginArgs,
  ActionError
>('user/userLogin', async ({ values }, { dispatch, rejectWithValue }) => {
  dispatch(httpActions.requestSend());

  try {
    await FirebaseAuthService.loginWithEmail(values.email, values.password);
    dispatch(httpActions.requestSuccess());
  } catch (err: any) {
    return handleThunkError({
      err,
      defaultMessage: 'Unable to login user.',
      dispatch,
      rejectWithValue,
    });
  }
});

// google login has to be a two-part chain when user has not been registered yet
// first part is login and preparing for optional register
export const handleUserLoginWithGoogleAuth = createAsyncThunk<
  boolean,
  undefined,
  ActionError
>(
  'user/handleUserLoginWithGoogleAuth',
  async (_, { dispatch, rejectWithValue }) => {
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
    } catch (err: any) {
      await FirebaseAuthService.signOut();
      return handleThunkError({
        err,
        defaultMessage: 'Cannot login with google account!',
        dispatch,
        rejectWithValue,
      });
    }
  },
);

export const userRegisterWithGoogleAuth = createAsyncThunk<
  undefined,
  UserRegisterArgs,
  ActionError
>(
  'user/userRegisterWithGoogleAuth',
  async ({ values }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      const user = FirebaseAuthService.getCurrentUser();
      let profilePictureURL: string;

      if (user) {
        if (values.profilePicture) {
          profilePictureURL = await handleUserPictureUpload(
            user.uid,
            values.profilePicture,
          );
        } else {
          profilePictureURL = user.photoURL ?? '';
        }

        const userData = prepareUserRegisterValues({
          ...values,
          userId: user.uid,
          email: user.email!,
          profilePicture: profilePictureURL,
        });

        await FirebaseFirestoreService.add('/users', userData.userId, userData);

        dispatch(
          httpActions.requestSuccess(
            'Succesfully created new user via Google.',
          ),
        );
      }
    } catch (err: any) {
      await FirebaseAuthService.signOut();
      return handleThunkError({
        err,
        defaultMessage: 'Cannot register with google account!',
        dispatch,
        rejectWithValue,
      });
    } finally {
      dispatch(userActions.setIsRegistering(false));
    }
  },
);

type UserState = {
  isRegistering?: boolean;
  isLoggedIn?: boolean;
  isAuthStateDetermined?: boolean;
  userDetails: User | null;
};

export const getAndStoreUserData = createAsyncThunk<
  UserState,
  string,
  ActionError
>('user/getAndStoreUserData', async (userId, { dispatch, rejectWithValue }) => {
  dispatch(httpActions.requestSend());

  try {
    const user = (await FirebaseFirestoreService.get('/users', [
      where('userId', '==', userId),
    ])) as User[];

    if (!user.length) {
      throw new Error('Unable to retrieve user data!');
    }

    dispatch(httpActions.requestSuccess());

    return {
      isLoggedIn: true,
      isAuthStateDetermined: true,
      userDetails: user[0],
    };
  } catch (err: any) {
    await FirebaseAuthService.signOut();
    return handleThunkError({
      err,
      dispatch,
      rejectWithValue,
    });
  }
});

export const updateRidePreferences = createAsyncThunk<
  RidePreferences,
  UpdateRidePreferencesArgs,
  ActionError
>(
  'user/updateRidePreferences',
  async ({ userId, values }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseFirestoreService.update('/users', userId, {
        ridePreferences: values,
      });

      dispatch(httpActions.requestSuccess("Updated user's ride preferences."));

      return values;
    } catch (err: any) {
      return handleThunkError({
        err,
        defaultMessage: 'Unable to update ride preferences!',
        dispatch,
        rejectWithValue,
      });
    }
  },
);

export const userLogout = createAsyncThunk<undefined, undefined, ActionError>(
  'user/userLogout',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseAuthService.signOut();
      dispatch(userActions.removeLoggedUser());
      dispatch(ridesActions.resetRides());
      dispatch(httpActions.requestSuccess('Signed out successfully'));
    } catch (err: any) {
      return handleThunkError({
        err,
        defaultMessage: 'Error while signing out.',
        dispatch,
        rejectWithValue,
      });
    }
  },
);

export const saveDriver = createAsyncThunk<string, SaveDriverArgs, ActionError>(
  'user/saveDriver',
  async ({ driverId, userDetails }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    const isDriverAlreadySaved = userDetails.savedDrivers?.find(
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
    } catch (err: any) {
      return handleThunkError({
        err,
        defaultMessage: 'Error when saving driver.',
        dispatch,
        rejectWithValue,
      });
    }
  },
);

export const unsaveDriver = createAsyncThunk<
  string,
  SaveDriverArgs,
  ActionError
>(
  'user/unsaveDriver',
  async ({ userDetails, driverId }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      await FirebaseFirestoreService.update('/users', userDetails.userId, {
        savedDrivers: arrayRemove(driverId),
      });

      dispatch(httpActions.requestSuccess('Driver removed.'));
      return driverId;
    } catch (err: any) {
      return handleThunkError({
        err,
        defaultMessage: 'Error when removing driver.',
        dispatch,
        rejectWithValue,
      });
    }
  },
);

export const fetchUsers = createAsyncThunk<User[], FetchUsersArgs, ActionError>(
  'user/fetchUsers',
  async ({ usersIds }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      const usersResponse = await Promise.all(
        usersIds.map(driverId =>
          FirebaseFirestoreService.get('/users', [
            where('userId', '==', driverId),
          ]),
        ),
      );

      if (!usersResponse.length) {
        throw new Error('Unable to retrieve drivers!');
      }

      const flatenedUsersResponse = usersResponse.map(
        driver => driver[0],
      ) as User[];

      dispatch(httpActions.requestSuccess());
      return flatenedUsersResponse;
    } catch (err: any) {
      return handleThunkError({
        err,
        defaultMessage: 'Error fetching users.',
        dispatch,
        rejectWithValue,
      });
    }
  },
);
