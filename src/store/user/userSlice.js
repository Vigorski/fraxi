import { createSlice } from '@reduxjs/toolkit';
import { userLogin, userRelogin, updateRidePreferences, userUpdate } from './userAsyncActions';

const initialState = {
	isLoggedIn: false,
	userDetails: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		removeLoggedUser(state) {
			state.userDetails = null;
			state.isLoggedIn = false;
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
	},
	extraReducers: (builder) => {
    builder.addCase(userUpdate.fulfilled, (state, action) => {
      state.userDetails = { ...state.userDetails, ...action.payload };
    });
		
		builder.addCase(userLogin.fulfilled, (state, action) => {
			state.userDetails = action.payload.user;
			state.isLoggedIn = action.payload.isLoggedIn;
		});
		
		builder.addCase(userRelogin.fulfilled, (state, action) => {
			state.userDetails = action.payload.user;
			state.isLoggedIn = action.payload.isLoggedIn;
		});
		
		builder.addCase(updateRidePreferences.fulfilled, (state, action) => {
			state.userDetails.ridePreferences = action.payload;
		});
	}
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
