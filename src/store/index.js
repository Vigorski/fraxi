import { configureStore } from '@reduxjs/toolkit';

import httpReducer from './http/httpSlice'
import authReducer from './auth/authSlice'
import errorReducer from './errors/errorSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    http: httpReducer,
    errors: errorReducer
  }
});

export default store;