import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { userActions } from 'store/user/userSlice';
import { httpActions } from 'store/http/httpSlice';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { USER_TYPES } from 'types/auth';
import {
  Ride,
  RIDE_STATUS,
  CreateRideFormValues,
  RideWithDriver,
  SearchRideFormValues,
} from 'types/ride';
import { Route } from 'types/map';
import { User } from 'types/user';
import {
  AddNewRideArgs,
  BookRideArgs,
  GetFilteredRidesArgs,
  GetFilteredRidesReturn,
  GetRidesStateArgs,
  GetRidesStateReturn,
  RemovePassengerFromRideArgs,
} from 'types/rideActions';
import { ActionError } from 'types/generalActions';

const transformRideValues = (
  driverId: string,
  route: Route,
  values: CreateRideFormValues,
): Ride => {
  const newRideId = 'ride_' + uuidv4();
  const creationDate = new Date().toUTCString();
  const departureDateParsed = values.departureDate.toUTCString();

  return {
    ...values,
    creationDate,
    departureDate: departureDateParsed,
    rideId: newRideId,
    driverId,
    route,
    passengers: [],
    status: RIDE_STATUS.active,
  };
};

const addDriversToRides = (
  rides: Ride[],
  drivers: User[],
): RideWithDriver[] => {
  return rides.map(ride => {
    // always returns an array with a single item
    const driverDetails = drivers.find(
      driver => driver.userId === ride.driverId,
    );

    if (!driverDetails) {
      throw new Error('Driver information is missing for one or more rides.');
    }

    return { ...ride, driverDetails: driverDetails };
  });
};

const updateRidesWithDriver = async (rides: Ride[]) => {
  const uniqueDriverIds: string[] = [];

  for (const ride of rides) {
    if (uniqueDriverIds.indexOf(ride.driverId) === -1) {
      uniqueDriverIds.push(ride.driverId);
    }
  }

  const driversResponse = await Promise.all(
    uniqueDriverIds.map(driverId =>
      FirebaseFirestoreService.get('/users', [where('userId', '==', driverId)]),
    ),
  );
  const flattenedDriversResponse = driversResponse.flat() as User[];
  const updatedRides = addDriversToRides(rides, flattenedDriversResponse);

  return updatedRides;
};

export const addNewRide = createAsyncThunk<Ride, AddNewRideArgs, ActionError>(
  'rides/addNewRide',
  async ({ driver, route, values }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      if (
        !('city' in route.origin.address_components) ||
        !('city' in route.destination.address_components)
      ) {
        throw new Error('Please select a location within city bounds');
      }

      const transformedValues = transformRideValues(
        driver.userId,
        route,
        values,
      );

      const transformedDriverActiveRides = {
        activeRides: [...driver.activeRides, transformedValues.rideId],
      };

      await Promise.all([
        FirebaseFirestoreService.add(
          '/rides',
          transformedValues.rideId,
          transformedValues,
        ),
        FirebaseFirestoreService.update('/users', driver.userId, {
          activeRides: arrayUnion(transformedValues.rideId),
        }),
      ]);

      dispatch(userActions.updateUserActiveRides(transformedDriverActiveRides));
      dispatch(httpActions.requestSuccess('New ride created.'));

      return transformedValues;
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Something went wrong!';
      dispatch(httpActions.requestError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

export const bookRide = createAsyncThunk<Ride, BookRideArgs, ActionError>(
  'rides/bookRide',
  async ({ passenger, ride, waypoints }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      if (ride.passengers.length === ride.maxPassengers) {
        throw new Error('Reached max passengers per ride!');
      }

      const transformedPassengerActiveRides = {
        activeRides: [...passenger.activeRides, ride.rideId],
      };

      await Promise.all([
        FirebaseFirestoreService.update('/rides', ride.rideId, {
          passengers: arrayUnion(passenger.userId),
          'route.waypoints': waypoints,
        }),
        FirebaseFirestoreService.update('/users', passenger.userId, {
          activeRides: arrayUnion(ride.rideId),
        }),
      ]);

      dispatch(
        userActions.updateUserActiveRides(transformedPassengerActiveRides),
      );
      dispatch(httpActions.requestSuccess('Ride booked.'));

      return ride;
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Something went wrong!';
      dispatch(httpActions.requestError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

export const removePassengerFromRide = createAsyncThunk<
  Ride,
  RemovePassengerFromRideArgs,
  ActionError
>(
  'rides/removePassengerFromRide',
  async ({ passenger, ride, waypoints }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      const comboRemoveRideCall = [
        FirebaseFirestoreService.update('/users', passenger.userId, {
          activeRides: arrayRemove(ride.rideId),
        }),
        FirebaseFirestoreService.update('/users', passenger.userId, {
          historyRides: arrayUnion(ride.rideId),
        }),
      ];

      if (passenger.userType === USER_TYPES.passenger) {
        comboRemoveRideCall.push(
          FirebaseFirestoreService.update('/rides', ride.rideId, {
            passengers: arrayRemove(passenger.userId),
            'route.waypoints': waypoints,
          }),
        );
      }

      if (passenger.userType === USER_TYPES.driver) {
        comboRemoveRideCall.push(
          FirebaseFirestoreService.update('/rides', ride.rideId, {
            status: RIDE_STATUS.canceled,
          }),
        );

        ride.passengers.forEach(passengerId => {
          comboRemoveRideCall.push(
            FirebaseFirestoreService.update('/users', passengerId, {
              activeRides: arrayRemove(ride.rideId),
            }),
          );
          comboRemoveRideCall.push(
            FirebaseFirestoreService.update('/users', passengerId, {
              historyRides: arrayUnion(ride.rideId),
            }),
          );
        });
      }

      await Promise.all(comboRemoveRideCall);

      dispatch(userActions.removeActiveRide(ride.rideId));
      dispatch(userActions.addHistoryRide(ride.rideId));
      dispatch(httpActions.requestSuccess('Ride canceled.'));

      return ride;
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Something went wrong!';
      dispatch(httpActions.requestError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

// TODO: perhaps populate history state at the same time?
// UPDATE: currently only fetching history on first load
export const getRidesState = createAsyncThunk<
  GetRidesStateReturn,
  GetRidesStateArgs,
  ActionError
>(
  'rides/getRidesState',
  async ({ rideIds, rideStatus }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      const ridesResponse = await Promise.all(
        rideIds.map(rideId =>
          FirebaseFirestoreService.get('/rides', [
            where('rideId', '==', rideId),
          ]),
        ),
      );
      const flatenedRidesResponse = ridesResponse.map(
        ride => ride[0],
      ) as Ride[];
      const activeDriversResponse = await Promise.all(
        flatenedRidesResponse.map(driver =>
          FirebaseFirestoreService.get('/users', [
            where('userId', '==', driver.driverId),
          ]),
        ),
      );
      const flatenedActiveDriversResponse = activeDriversResponse.map(
        driver => driver[0],
      ) as User[];
      const ridesWithTheirDriver = addDriversToRides(
        flatenedRidesResponse,
        flatenedActiveDriversResponse,
      );

      dispatch(httpActions.requestSuccess());
      return { ridesWithTheirDriver, rideStatus };
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Something went wrong!';
      dispatch(httpActions.requestError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

export const getFilteredRides = createAsyncThunk<
  GetFilteredRidesReturn,
  GetFilteredRidesArgs,
  ActionError
>(
  'rides/getFilteredRides',
  async ({ searchPreferences }, { dispatch, rejectWithValue }) => {
    dispatch(httpActions.requestSend());

    try {
      const fullDBPaths = [
        'route.destination.address_components.city',
        'route.origin.address_components.city',
        'rideType',
        'smoking',
      ];
      const propertyNames = ['destination', 'origin', 'rideType', 'smoking'];
      const queryParams = [where('status', '==', RIDE_STATUS.active)]; // mandatory query - will search only active rides

      fullDBPaths.forEach((param, index) => {
        const propertyName = propertyNames[index] as keyof SearchRideFormValues;

        if (searchPreferences[propertyName]) {
          queryParams.push(where(param, '==', searchPreferences[propertyName]));
        }
      });

      const ridesResponse = (await FirebaseFirestoreService.get(
        '/rides',
        queryParams,
      )) as Ride[];

      if (ridesResponse) {
        const updatedRides = await updateRidesWithDriver(ridesResponse);
        dispatch(httpActions.requestSuccess());
        return updatedRides;
      }

      dispatch(httpActions.requestSuccess());
      return null;
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'Something went wrong!';
      dispatch(httpActions.requestError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);
