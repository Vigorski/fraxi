import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import RegisterOAuth from 'pages/auth/RegisterOAuth';
import SearchRides from 'pages/rides/SearchRides';
import RideDetails from 'pages/rides/RideDetails';
import MyProfile from 'pages/user/MyProfile';
import EditMyProfile from 'pages/user/EditMyProfile';
import EditMyPreferences from 'pages/user/passenger/EditMyPreferences';
import CreateRide from 'pages/rides/CreateRide';
import UsersOwnActiveRides from 'pages/rides/UsersOwnActiveRides';
import SavedDriverActiveRides from 'pages/rides/SavedDriverActiveRides';
import {
  LOGIN,
  REGISTER,
  SEARCH_RIDES,
  RIDE_DETAILS,
  MY_PROFILE,
  EDIT_USER,
  EDIT_PREFERENCES,
  CREATE_RIDE,
  DRIVER_ACTIVE_RIDES,
  USERS_OWN_ACTIVE_RIDES,
  REGISTER_OAUTH,
  PAGE_NOT_FOUND,
} from './routesConfig';
import { USER_TYPES } from './userTypes';
import NotFound from 'layout/NotFound';

export const authRouteGroup = [
  { path: LOGIN.path, component: Login },
  { path: REGISTER.path, component: Register },
  { path: REGISTER_OAUTH.path, component: RegisterOAuth },
];

export const profileRouteGroup = [
  {
    path: `${MY_PROFILE.path}${EDIT_USER.path}`,
    component: EditMyProfile,
    roles: [USER_TYPES.driver, USER_TYPES.passenger],
    pathDetails: EDIT_USER,
  },
  {
    path: MY_PROFILE.path,
    component: MyProfile,
    roles: [USER_TYPES.driver, USER_TYPES.passenger],
    pathDetails: MY_PROFILE,
  },
];

export const passengerRouteGroup = [
  {
    path: `${MY_PROFILE.path}${EDIT_PREFERENCES.path}`,
    component: EditMyPreferences,
    roles: [USER_TYPES.passenger],
    pathDetails: EDIT_PREFERENCES,
  },
  {
    path: SEARCH_RIDES.path,
    component: SearchRides,
    roles: [USER_TYPES.passenger],
    pathDetails: SEARCH_RIDES,
  },
];

export const driverRouteGroup = [
  {
    path: `${MY_PROFILE.path}${CREATE_RIDE.path}`,
    component: CreateRide,
    roles: [USER_TYPES.driver],
    pathDetails: CREATE_RIDE,
  },
];

export const ridesRouteGroup = [
  {
    path: `${MY_PROFILE.path}${DRIVER_ACTIVE_RIDES.path}`,
    component: SavedDriverActiveRides,
    roles: [USER_TYPES.passenger],
    pathDetails: DRIVER_ACTIVE_RIDES,
  },
  {
    path: USERS_OWN_ACTIVE_RIDES.path,
    component: UsersOwnActiveRides,
    roles: [USER_TYPES.driver, USER_TYPES.passenger],
    pathDetails: USERS_OWN_ACTIVE_RIDES,
  },
  {
    path: `${RIDE_DETAILS.path}`,
    component: RideDetails,
    roles: [USER_TYPES.passenger, USER_TYPES.driver],
    pathDetails: RIDE_DETAILS,
  },
];

export const errorRouteGroup = [
  {
    path: PAGE_NOT_FOUND.path,
    component: NotFound,
    roles: [USER_TYPES.driver, USER_TYPES.passenger],
    pathDetails: PAGE_NOT_FOUND,
  },
];
