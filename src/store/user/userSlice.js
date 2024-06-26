import { createSlice } from '@reduxjs/toolkit';
import {
  getAndStoreUserData,
  updateRidePreferences,
  userUpdate,
  saveDriver,
  unsaveDriver,
} from './userAsyncActions';

const initialState = {
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
    updateUserDetails(state, action) {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
    addHistoryRide(state, action) {
      state.userDetails.historyRides.push(action.payload);
    },
    removeActiveRide(state, action) {
      state.userDetails.activeRides.forEach((rideId, i) => {
        if (rideId === action.payload) {
          state.userDetails.activeRides.splice(i, 1);
          return;
        }
      });
    },
    setIsAuthStateDetermined(state, action) {
      state.isAuthStateDetermined = action.payload;
    },
    setIsRegistering(state, action) {
      state.isRegistering = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(userUpdate.fulfilled, (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    });

    builder.addCase(getAndStoreUserData.fulfilled, (state, action) => {
      state.userDetails = action.payload.user;
      state.isAuthStateDetermined = action.payload.isAuthStateDetermined;
      state.isLoggedIn = action.payload.isLoggedIn;
    });

    builder.addCase(updateRidePreferences.fulfilled, (state, action) => {
      state.userDetails.ridePreferences = action.payload;
    });

    builder.addCase(saveDriver.fulfilled, (state, action) => {
      state.userDetails.savedDrivers.push(action.payload);
    });

    builder.addCase(unsaveDriver.fulfilled, (state, action) => {
      state.userDetails.savedDrivers.forEach((driverId, i) => {
        if (driverId === action.payload) {
          state.userDetails.savedDrivers.splice(i, 1);
          return;
        }
      });
    });
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
