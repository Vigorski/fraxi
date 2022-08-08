import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import SearchRides from '../../pages/search/SearchRides';
import MyProfile from '../../pages/user/MyProfile';
import EditMyProfile from '../../pages/user/EditMyProfile';
import EditMyPreferences from '../../pages/user/passenger/EditMyPreferences';
import CreateRide from '../../pages/user/driver/CreateRide';

import { LOGIN, REGISTER, SEARCH_RIDES, MY_PROFILE, EDIT_USER, EDIT_PREFERENCES, CREATE_RIDE } from './routes';
import { DRIVER, PASSENGER } from './users';

export const authRouteGroup = [
	{ path: LOGIN.path, component: Login },
	{ path: REGISTER.path, component: Register },
];

export const profileRouteGroup = [
	{ path: `${MY_PROFILE.path}${EDIT_USER.path}`, component: EditMyProfile, roles: [DRIVER, PASSENGER], pathDetails: EDIT_USER },
	{ path: MY_PROFILE.path, component: MyProfile, roles: [DRIVER, PASSENGER], pathDetails: MY_PROFILE },
];

export const passengerRouteGroup = [
	{ path: `${MY_PROFILE.path}${EDIT_PREFERENCES.path}`, component: EditMyPreferences, roles: [PASSENGER], pathDetails: EDIT_PREFERENCES },
	{ path: SEARCH_RIDES.path, component: SearchRides, roles: [PASSENGER], pathDetails: SEARCH_RIDES },
];

export const driverRouteGroup = [{ path: `${MY_PROFILE.path}${CREATE_RIDE.path}`, component: CreateRide, roles: [DRIVER], pathDetails: CREATE_RIDE }];
