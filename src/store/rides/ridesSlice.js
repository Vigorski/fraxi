import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	activeRides: [],
	ridesHistory: [],
	filteredRides: []
};

const ridesSlice = createSlice({
	name: 'rides',
	initialState,
	reducers: {
		populateActiveRides(state, action) {
			state.activeRides = action.payload;
		},
		populateFilteredRides(state, action) {
			state.filteredRides = action.payload;
		},
		addActiveRide(state, action) {
			state.activeRides.push(action.payload);
		},
		// removeRide (state, action) {
		// },
		populateRidesHistory(state, action) {
			state.ridesHistory = action.payload;
		},
		addRideToHistory(state, action) {
			state.ridesHistory.push(action.payload);
		},
		resetRides(state) {
			state.activeRides = [];
			state.ridesHistory = [];
		}
	},
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
