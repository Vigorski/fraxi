import { Place, Route } from './map';
import { User } from './user';

export enum RIDE_STATUS {
  active = 'active',
  canceled = 'canceled',
  finished = 'finished',
}

export enum SMOKING {
  noPreference,
  noSmoking,
  smoking,
}

export const SMOKING_LABEL: { [key in SMOKING]: string } = {
  [SMOKING.noPreference]: 'No preference',
  [SMOKING.noSmoking]: 'No smoking',
  [SMOKING.smoking]: 'Smoking',
};

export enum MAX_PASSENGERS {
  noPreference,
  one,
  two,
  three,
  four,
}

export const MAX_PASSENGERS_LABEL: { [key in MAX_PASSENGERS]: string } = {
  [MAX_PASSENGERS.noPreference]: 'No preference',
  [MAX_PASSENGERS.one]: '1',
  [MAX_PASSENGERS.two]: '2',
  [MAX_PASSENGERS.three]: '3',
  [MAX_PASSENGERS.four]: '4',
};

export enum RIDE_TYPE {
  noPreference,
  regular,
  irregular,
}

export const RIDE_TYPE_LABEL: { [key in RIDE_TYPE]: string } = {
  [RIDE_TYPE.noPreference]: 'No preference',
  [RIDE_TYPE.regular]: 'regular',
  [RIDE_TYPE.irregular]: 'irregular',
};

export type RidePreferences = {
  origin: string;
  destination: string;
  maxPassengers: number;
  smoking: number;
  rideType: number;
};

export type RideBase = {
  maxPassengers: MAX_PASSENGERS;
  rideType: RIDE_TYPE;
  smoking: SMOKING;
  price: number;
};

export interface CreateRideFormValues extends RideBase {
  departureDate: Date;
}

export interface SearchRideFormValues extends RideBase {
  origin: Place;
  destination: Place;
}

export interface Ride extends RideBase {
  creationDate: string;
  departureDate: string;
  driverId: string;
  rideId: string;
  route: Route;
  passengers: string[];
  status: RIDE_STATUS;
}

export interface RideWithDriver extends Ride {
  driverDetails: User;
}
