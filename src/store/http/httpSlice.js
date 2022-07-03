import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	status: '',
	data: null,
	error: null,
};

const httpSlice = createSlice({
	name: 'http',
	initialState,
	reducers: {
    requestReset(state) {
      state.status = '';
      state.data = null;
      state.error = null;
    },
		requestSend(state) {
      state.status = 'pending';
      state.data = null;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.status = 'completed';
      state.data = action.payload;
      state.error = null;
    },
    requestError(state, action) {
      state.status = 'completed';
      state.data = null;
      state.error = action.payload.errorMessage;
    }
	},
});

export const httpActions = httpSlice.actions;

export default httpSlice.reducer;
