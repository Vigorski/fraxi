import { User, UserForm } from './user';
import { RidePreferences } from './ride';

export type UserRegisterArgs = {
  values: UserForm;
};

export type UserUpdateArgs = {
  userId: string;
  values: UserForm;
};

export type UserUpdateReturn = {
  name: string;
  surname: string;
  profilePicture?: string;
  phone?: string;
};

export type UserLoginArgs = {
  values: {
    email: string;
    password: string;
  };
};

export type UpdateRidePreferencesArgs = {
  userId: string;
  values: RidePreferences;
};

export type SaveDriverArgs = {
  driverId: string;
  userDetails: User;
};

export type FetchUsersArgs = {
  usersIds: string[];
};
