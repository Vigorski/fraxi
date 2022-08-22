import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import SearchRides from '../../pages/rides/searchRides/SearchRides';
import RideDetails from '../../pages/rides/rideDetails/RideDetails';
import MyProfile from '../../pages/user/MyProfile';
import EditMyProfile from '../../pages/user/EditMyProfile';
import EditMyPreferences from '../../pages/user/passenger/EditMyPreferences';
import CreateRide from '../../pages/user/driver/CreateRide';
import ActiveRides from '../../pages/rides/activeRides/ActiveRides';

import { LOGIN, REGISTER, SEARCH_RIDES, RIDE_DETAILS, MY_PROFILE, EDIT_USER, EDIT_PREFERENCES, CREATE_RIDE, ACTIVE_RIDES } from './routes';
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

export const ridesRouteGroup = [
	{ path: `${ACTIVE_RIDES.path}`, component: ActiveRides, roles: [DRIVER, PASSENGER], pathDetails: ACTIVE_RIDES },
	{ path: `${RIDE_DETAILS.path}/:rideId`, component: RideDetails, roles: [PASSENGER, DRIVER], pathDetails: RIDE_DETAILS },
];
