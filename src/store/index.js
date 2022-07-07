import { configureStore } from '@reduxjs/toolkit';

import httpReducer from './http/httpSlice'
import userReducer from './user/userSlice'
import errorReducer from './errors/errorSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    http: httpReducer,
    errors: errorReducer
  }
});

export default store;