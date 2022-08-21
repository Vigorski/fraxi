import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isLoggedIn: false,
	userDetails: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		addLoggedInUser(state, action) {
			state.userDetails = action.payload.user;
			state.isLoggedIn = action.payload.isLoggedIn;
		},
		removeLoggedUser(state) {
			state.userDetails = null;
			state.isLoggedIn = false;
		},
		updateRidePreferences(state, action) {
			state.userDetails.ridePreferences = action.payload;
		},
		updateUserDetails(state, action) {
			state.userDetails = { ...state.userDetails, ...action.payload };
		},
		removeActiveRide(state, action) {
			state.userDetails.activeRides.forEach((rideId, i) => {
				if (rideId === action.payload) {
					state.userDetails.activeRides.splice(i, 1);
					return;
				}
			});
		},
		addHistoryRide(state, action) {
			state.userDetails.historyRides.push(action.payload);
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
