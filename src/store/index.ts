import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import ridesReducer from './rides/ridesSlice';
import httpReducer from './http/httpSlice';
import routeReducer from './routes/routeSlice';
import errorReducer from './errors/errorSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    rides: ridesReducer,
    http: httpReducer,
    route: routeReducer,
    errors: errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
