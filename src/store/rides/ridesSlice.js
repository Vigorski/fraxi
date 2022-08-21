import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	activeRides: [],
	historyRides: [],
	filteredRides: [],
};

const ridesSlice = createSlice({
	name: 'rides',
	initialState,
	reducers: {
		addActiveRide(state, action) {
			state.activeRides.push(action.payload);
		},
		removeActiveRide(state, action) {
			state.activeRides.forEach((ride, i) => {
				if (ride.rideId === action.payload) {
					state.activeRides.splice(i, 1);
					return;
				}
			});
		},
		populateActiveRides(state, action) {
			state.activeRides = action.payload;
		},
		populateFilteredRides(state, action) {
			state.filteredRides = action.payload;
		},
		addHistoryRide(state, action) {
			state.historyRides.push(action.payload);
		},
		populateHistoryRides(state, action) {
			state.historyRides = action.payload;
		},
		resetRides(state) {
			state.activeRides = [];
			state.historyRides = [];
			state.filteredRides = [];
		},
	},
});

export const ridesActions = ridesSlice.actions;

export default ridesSlice.reducer;
