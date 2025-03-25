import { RouteDetails } from "types/route";

export const LOGIN: RouteDetails = {
  title: 'Login',
  path: '/login',
  description: 'Login page',
};

export const REGISTER: RouteDetails = {
  title: 'Register',
  path: '/register',
  description: 'Register page',
};

export const REGISTER_OAUTH: RouteDetails = {
  title: 'Register via third-party provider',
  path: '/register-via-external-provider',
  description: 'Third-party provider register page',
};

export const SEARCH_RIDES: RouteDetails = {
  title: 'Search rides',
  path: '/search-rides',
  description: 'Search for avaiable rides',
};

export const RIDE_DETAILS: RouteDetails = {
  title: 'Ride details',
  path: '/ride-details',
  description: 'Details of individual ride',
};

export const MY_PROFILE: RouteDetails = {
  title: 'My profile',
  path: '/my-profile',
  description: 'My profile page',
};

export const EDIT_USER: RouteDetails = {
  title: 'Edit user profile',
  path: '/edit-user',
  description: 'Edit user details',
};

export const EDIT_PREFERENCES: RouteDetails = {
  title: 'Edit user preferences',
  path: '/edit-preferences',
  description: 'Edit user preferences',
};

export const CREATE_RIDE: RouteDetails = {
  title: 'Create a new ride',
  path: '/create-ride',
  description: 'Create a new ride',
};

export const DRIVER_ACTIVE_RIDES: RouteDetails = {
  title: 'Saved driver rides',
  path: '/driver-active-rides',
  description: "Saved driver's rides",
};

export const USERS_OWN_ACTIVE_RIDES: RouteDetails = {
  title: 'Your bookings',
  path: '/active-rides',
  description: 'Booked and active rides',
};

export const PAGE_NOT_FOUND: RouteDetails = {
  title: 'Page not found',
  path: '/not-found',
  description: 'Page not found',
};
