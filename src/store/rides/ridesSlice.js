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
		addActiveRide(state, action) {
			state.activeRides.push(action.payload);
		},
		populateActiveRides(state, action) {
			state.activeRides = action.payload;
		},
		populateFilteredRides(state, action) {
			state.filteredRides = action.payload;
		},
		populateRidesHistory(state, action) {
			state.ridesHistory = action.payload;
		},
		resetRides(state) {
			state.activeRides = [];
			state.ridesHistory = [];
			state.filteredRides = [];
		}
	},
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
