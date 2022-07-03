import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalFormError: ''
}

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setGlobalFormError (state, action) {
      state.globalFormError = action.payload.errorMessage
    }
  }
});

export const errorActions = errorSlice.actions;

export default errorSlice.reducer;