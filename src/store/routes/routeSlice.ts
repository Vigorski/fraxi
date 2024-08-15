import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteDetails } from 'types/route';

type RouteState = {
	currentRoute: RouteDetails | null;
}

const initialState: RouteState = {
  currentRoute: null,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    changeCurrentRoute(state, action: PayloadAction<RouteDetails>) {
      state.currentRoute = action.payload;
    },
  },
});

export const routeActions = routeSlice.actions;

export default routeSlice.reducer;
