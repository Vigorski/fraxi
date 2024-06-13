import { createSlice } from '@reduxjs/toolkit';
import {
  HTTP_REQUEST_STATUS
} from 'types/httpRequestStatus';

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
      state.status = HTTP_REQUEST_STATUS.pending;
      state.message = null;
    },
    requestSuccess(state, action) {
      state.status = HTTP_REQUEST_STATUS.fullfilled;
      state.message = action.payload;
    },
    requestError(state, action) {
      state.status = HTTP_REQUEST_STATUS.rejected;
      state.message = action.payload;
    },
  },
});

export const httpActions = httpSlice.actions;

export default httpSlice.reducer;
