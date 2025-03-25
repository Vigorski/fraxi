import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ErrorState = {
  globalFormError: string;
};

const initialState: ErrorState = {
  globalFormError: '',
};

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setGlobalFormError(state, action: PayloadAction<{ errorMessage: string }>) {
      state.globalFormError = action.payload.errorMessage;
    },
  },
});

export const errorActions = errorSlice.actions;

export default errorSlice.reducer;
