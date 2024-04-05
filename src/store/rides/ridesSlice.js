import { createSlice } from '@reduxjs/toolkit';
import {
  addNewRide,
  bookRide,
  removePassengerRide,
  getRidesState,
  getFilteredRides,
} from './ridesAsyncActions';

const initialState = {
  activeRides: [],
  historyRides: [],
  filteredRides: [],
};

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    resetRides(state) {
      state.activeRides = [];
      state.historyRides = [];
      state.filteredRides = [];
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
      state[action.payload.ridesMethod] = action.payload.updatedRides;
    });
    builder.addCase(getFilteredRides.fulfilled, (state, action) => {
      state.filteredRides = action.payload;
    });
  },
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
