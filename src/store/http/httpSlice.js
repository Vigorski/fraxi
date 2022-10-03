import { createSlice } from '@reduxjs/toolkit';

import { PENDING, FULLFILLED, REJECTED } from '../../utilities/constants/httpRequestStatus'

const initialState = {
	status: '',
	message: null,
};

const httpSlice = createSlice({
	name: 'http',
	initialState,
	reducers: {
    requestReset(state) {
      state.status = '';
      state.message = null;
    },
		requestSend(state) {
      state.status = PENDING;
      state.message = null;
    },
    requestSuccess(state, action) {
      state.status = FULLFILLED;
      state.message = action.payload;
    },
    requestError(state, action) {
      state.status = REJECTED;
      state.message = action.payload;
    }
	},
});

export const httpActions = httpSlice.actions;

export default httpSlice.reducer;
