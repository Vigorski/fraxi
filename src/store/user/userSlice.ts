import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAndStoreUserData,
  updateRidePreferences,
  userUpdate,
  saveDriver,
  unsaveDriver,
} from './userAsyncActions';
import { User } from 'types/user';

export type UserState = {
  isRegistering?: boolean;
  isLoggedIn?: boolean;
  isAuthStateDetermined?: boolean;
  userDetails: User | null;
};

const initialState: UserState = {
  isRegistering: false,
  isLoggedIn: false,
  isAuthStateDetermined: false,
  userDetails: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeLoggedUser(state) {
      state.userDetails = null;
      state.isLoggedIn = false;
      state.isAuthStateDetermined = false;
    },
    updateUserActiveRides(
      state,
      action: PayloadAction<{ activeRides: string[] }>,
    ) {
      if (state.userDetails) {
        state.userDetails = { ...state.userDetails, ...action.payload };
      }
    },
    removeActiveRide(state, action: PayloadAction<string>) {
      state.userDetails?.activeRides.forEach((rideId, i) => {
        if (rideId === action.payload) {
          state.userDetails?.activeRides.splice(i, 1);
          return;
        }
      });
    },
    addHistoryRide(state, action: PayloadAction<string>) {
      state.userDetails?.historyRides.push(action.payload);
    },
    setIsAuthStateDetermined(state, action: PayloadAction<boolean>) {
      state.isAuthStateDetermined = action.payload;
    },
    setIsRegistering(state, action: PayloadAction<boolean>) {
      state.isRegistering = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(userUpdate.fulfilled, (state, action) => {
      if (state.userDetails) {
        state.userDetails = { ...state.userDetails, ...action.payload };
      }
    });

    builder.addCase(getAndStoreUserData.fulfilled, (state, action) => {
      state.userDetails = action.payload.userDetails;
      state.isAuthStateDetermined = action.payload.isAuthStateDetermined;
      state.isLoggedIn = action.payload.isLoggedIn;
    });

    builder.addCase(updateRidePreferences.fulfilled, (state, action) => {
      if (state.userDetails) {
        state.userDetails.ridePreferences = action.payload;
      }
    });

    builder.addCase(saveDriver.fulfilled, (state, action) => {
      state.userDetails?.savedDrivers?.push(action.payload);
    });

    builder.addCase(unsaveDriver.fulfilled, (state, action) => {
      state.userDetails?.savedDrivers?.forEach((driverId, i) => {
        if (driverId === action.payload) {
          state.userDetails?.savedDrivers?.splice(i, 1);
          return;
        }
      });
    });
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
