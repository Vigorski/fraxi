import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/userSlice';
import ridesReducer from './rides/ridesSlice';
import httpReducer from './http/httpSlice';
import errorReducer from './errors/errorSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    rides: ridesReducer,
    http: httpReducer,
    errors: errorReducer
  }
});

export default store;