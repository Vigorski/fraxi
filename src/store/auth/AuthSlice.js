import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userDetails: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addLoggedInUser (state, action) {
      state.userDetails = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;

    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;