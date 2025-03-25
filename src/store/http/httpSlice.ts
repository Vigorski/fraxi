import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HTTP_REQUEST_STATUS } from 'types/httpRequestStatus';

type HttpState = {
  status?: HTTP_REQUEST_STATUS;
  message?: string;
};

const initialState: HttpState = {
  status: undefined,
  message: undefined,
};

const httpSlice = createSlice({
  name: 'http',
  initialState,
  reducers: {
    requestReset(state) {
      state.status = undefined;
      state.message = undefined;
    },
    requestSend(state) {
      state.status = HTTP_REQUEST_STATUS.pending;
      state.message = undefined;
    },
    requestSuccess(state, action: PayloadAction<string | undefined>) {
      state.status = HTTP_REQUEST_STATUS.fullfilled;
      state.message = action.payload;
    },
    requestError(state, action: PayloadAction<string>) {
      state.status = HTTP_REQUEST_STATUS.rejected;
      state.message = action.payload;
    },
  },
});

export const httpActions = httpSlice.actions;

export default httpSlice.reducer;
