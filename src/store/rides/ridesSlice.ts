import { createSlice } from '@reduxjs/toolkit';
import {
  addNewRide,
  bookRide,
  removePassengerFromRide,
  getRidesState,
} from './ridesAsyncActions';
import { Ride } from 'types/ride';

type RidesState = {
  activeRides: Ride[];
  historyRides: Ride[];
}

const initialState: RidesState = {
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
    builder.addCase(removePassengerFromRide.fulfilled, (state, action) => {
      state.historyRides.push(action.payload);
      state.activeRides.forEach((ride, i) => {
        if (ride.rideId === action.payload.rideId) {
          state.activeRides.splice(i, 1);
          return;
        }
      });
    });
    builder.addCase(getRidesState.fulfilled, (state, action) => {
      if (action.payload.rideStatus) {
        state[action.payload.rideStatus as keyof RidesState] = action.payload.ridesWithTheirDriver;
      }
    });
  },
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
