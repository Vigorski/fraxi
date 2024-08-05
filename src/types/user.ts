import { USER_TYPES } from './auth';

type RidePreferences = {
  origin: string;
  destination: string;
  maxPassengers: number;
  smoking: number;
  rideType: number;
};

export type User = {
  id: string;
  userId: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  profilePicture: string;
  userType: USER_TYPES;
  ridePreferences?: RidePreferences;
  savedDrivers?: string[];
  historyRides: string[];
  activeRides: string[];
};
