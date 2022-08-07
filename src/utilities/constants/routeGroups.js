import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import SearchRides from '../../pages/search/SearchRides';
import MyProfile from '../../pages/user/MyProfile';
import EditMyProfile from '../../pages/user/EditMyProfile';
import EditMyPreferences from '../../pages/user/passenger/EditMyPreferences';
import CreateRide from '../../pages/user/driver/CreateRide';

import { LOGIN, REGISTER, SEARCH_RIDES, MY_PROFILE } from './routes';
import { DRIVER, PASSENGER } from './users';


export const authRouteGroup = [
  {path: LOGIN.path, component: Login},
  {path: REGISTER.path, component: Register}
];

export const profileRouteGroup = [
  {path: MY_PROFILE.path, component: MyProfile, roles: [DRIVER, PASSENGER]},
  {path: `${MY_PROFILE.path}/edit-user`, component: EditMyProfile, role: [DRIVER, PASSENGER]}
];

export const passengerRouteGroup = [
  {path: `${MY_PROFILE.path}/edit-preferences`, component: EditMyPreferences, role: [PASSENGER]},
  {path: SEARCH_RIDES.path, component: SearchRides, roles: [PASSENGER]}
];

export const driverRouteGroup = [
  {path: `${MY_PROFILE.path}/create-ride`, component: CreateRide, roles: [DRIVER]}
];