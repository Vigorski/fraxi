import { createSlice } from '@reduxjs/toolkit';
import {
  addNewRide,
  bookRide,
  removePassengerRide,
  getRidesState,
} from './ridesAsyncActions';

const initialState = {
  activeRides: [],
  historyRides: [],
};

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    resetRides(state) {
      state.activeRides = [];
      state.historyRides = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(addNewRide.fulfilled, (state, action) => {
      state.activeRides.push(action.payload);
    });
    builder.addCase(bookRide.fulfilled, (state, action) => {
      state.activeRides.push(action.payload);
    });
    builder.addCase(removePassengerRide.fulfilled, (state, action) => {
      state.historyRides.push(action.payload);
      state.activeRides.forEach((ride, i) => {
        if (ride.rideId === action.payload.rideId) {
          state.activeRides.splice(i, 1);
          return;
        }
      });
    });
    builder.addCase(getRidesState.fulfilled, (state, action) => {
      if (!!action.payload.userType) {
        state[action.payload.userType] = action.payload.ridesAndDrivers;
      }
    });
  },
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
