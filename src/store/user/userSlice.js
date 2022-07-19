import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userDetails: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addLoggedInUser (state, action) {
      state.userDetails = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    removeLoggedUser (state) {
      state.userDetails = null;
      state.isLoggedIn = false;
    },
    updateRoutePreferences (state, action) {
      state.userDetails.routePreferences = action.payload;
    }
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;