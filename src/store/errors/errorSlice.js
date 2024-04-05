import { createSlice } from '@reduxjs/toolkit';

// #TODO: this global error might be obsolete. Check after implementing auth

const initialState = {
  globalFormError: '',
};

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setGlobalFormError(state, action) {
      state.globalFormError = action.payload.errorMessage;
    },
  },
});

export const errorActions = errorSlice.actions;

export default errorSlice.reducer;
