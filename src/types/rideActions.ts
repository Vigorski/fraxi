import { Route, Waypoint } from './map';
import {
  Ride,
  CreateRideFormValues,
  RideWithDriver,
  SearchRideFormValues,
} from './ride';
import { User } from './user';

export type AddNewRideArgs = {
  driver: User;
  route: Route;
  values: CreateRideFormValues;
};

export type BookRideArgs = {
  passenger: User;
  ride: Ride;
  waypoints: Waypoint[];
};

export type RemovePassengerFromRideArgs = BookRideArgs;

type RideStatus = 'driver' | 'passenger';

export type GetRidesStateArgs = {
  rideIds: string[];
  rideStatus?: RideStatus;
};

export type GetRidesStateReturn = {
  ridesWithTheirDriver: RideWithDriver[];
  rideStatus?: RideStatus;
};

export type GetFilteredRidesArgs = {
  searchPreferences: SearchRideFormValues;
};

export type GetFilteredRidesReturn = RideWithDriver[] | null;
