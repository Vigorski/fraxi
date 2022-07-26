import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	activeRides: [],
	ridesHistory: [],
};

const ridesSlice = createSlice({
	name: 'rides',
	initialState,
	reducers: {
		populateActiveRides(state, action) {
			state.activeRides = action.payload;
		},
		addActiveRide(state, action) {
			state.activeRides.push(action.payload);
		},
		// removeRide (state, action) {
		//   state.activeRides.push(action.payload);
		// },
		populateRidesHistory(state, action) {
			state.ridesHistory = action.payload;
		},
		addRideToHistory(state, action) {
			state.ridesHistory.push(action.payload);
		},
	},
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
