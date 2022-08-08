import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRoute: null
}

const routeSlice = createSlice({
	name: 'route',
	initialState,
	reducers: {
		changeCurrentRoute(state, action) {
			state.currentRoute = action.payload;
		},
	},
});

export const routeActions = routeSlice.actions;

export default routeSlice.reducer;