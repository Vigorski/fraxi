import { USER_TYPES } from './auth';
import { RidePreferences } from './ride';

export type UserId = {
  userId: string;
};

export type UserBase<T> = {
  name: string;
  surname: string;
  email: string;
  userType: USER_TYPES;
  phone?: string;
  profilePicture?: T;
};

export type UserExtras = {
  ridePreferences?: RidePreferences | {};
  savedDrivers: string[];
  historyRides: string[];
  activeRides: string[];
};

export interface UserForm<T = File> extends UserBase<T> {
  password: string;
  confirmPassword: string;
}

export interface User<T = string> extends UserBase<T>, UserExtras, UserId {
  id: string;
}
