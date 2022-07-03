import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  userDetails: {}
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addLoggedInUser (state, action) {
      console.log(action)
      state.userDetails = action.payload.user
    }
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;