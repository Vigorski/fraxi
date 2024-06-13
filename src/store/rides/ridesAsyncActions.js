import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { where, arrayUnion, arrayRemove } from 'firebase/firestore';
import { userActions } from 'store/user/userSlice';
import { httpActions } from 'store/http/httpSlice';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { USER_TYPES } from 'types/auth';
import { RIDE_STATUS } from 'types/rides';

const transformRideValues = (driverId, route, values) => {
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

const addDriverToRide = (rides, drivers) => {
  const updatedRides = rides.map(ride => {
    // always returns an array with a single item
    const driverDetails = drivers.find(
      driver => driver[0].userId === ride.driverId,
    );
    return { ...ride, driverDetails: driverDetails[0] };
  });

  return updatedRides;
};

const updateRidesWithDriver = async rides => {
  const uniqueDriverIds = [];

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
  const updatedRides = addDriverToRide(rides, driversResponse);

  return updatedRides;
};

export const addNewRide = createAsyncThunk(
  'rides/addNewRide',
  async ({ driver, route, values }, { dispatch }) => {
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

      dispatch(userActions.updateUserDetails(transformedDriverActiveRides));
      dispatch(httpActions.requestSuccess('New ride created.'));

      return transformedValues;
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);

export const bookRide = createAsyncThunk(
  'rides/bookRide',
  async ({ passenger, rideDetails, waypoints }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      if (rideDetails.passengers.length === rideDetails.maxPassengers) {
        throw new Error('Reached max passengers per ride!');
      }

      const transformedPassengerActiveRides = {
        activeRides: [...passenger.activeRides, rideDetails.rideId],
      };

      await Promise.all([
        FirebaseFirestoreService.update('/rides', rideDetails.rideId, {
          passengers: arrayUnion(passenger.userId),
          'route.waypoints': waypoints,
        }),
        FirebaseFirestoreService.update('/users', passenger.userId, {
          activeRides: arrayUnion(rideDetails.rideId),
        }),
      ]);

      dispatch(userActions.updateUserDetails(transformedPassengerActiveRides));
      dispatch(httpActions.requestSuccess('Ride booked.'));

      return rideDetails;
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);

export const removePassengerRide = createAsyncThunk(
  'rides/removePassengerRide',
  async ({ rideDetails, userDetails, waypoints }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const comboRemoveRideCall = [
        FirebaseFirestoreService.update('/users', userDetails.userId, {
          activeRides: arrayRemove(rideDetails.rideId),
        }),
        FirebaseFirestoreService.update('/users', userDetails.userId, {
          historyRides: arrayUnion(rideDetails.rideId),
        }),
      ];

      if (userDetails.userType === USER_TYPES.passenger) {
        comboRemoveRideCall.push(
          FirebaseFirestoreService.update('/rides', rideDetails.rideId, {
            passengers: arrayRemove(userDetails.userId),
            'route.waypoints': waypoints,
          }),
        );
      }

      if (userDetails.userType === USER_TYPES.driver) {
        comboRemoveRideCall.push(
          FirebaseFirestoreService.update('/rides', rideDetails.rideId, {
            status: RIDE_STATUS.canceled,
          }),
        );

        rideDetails.passengers.forEach(passengerId => {
          comboRemoveRideCall.push(
            FirebaseFirestoreService.update('/users', passengerId, {
              activeRides: arrayRemove(rideDetails.rideId),
            }),
          );
          comboRemoveRideCall.push(
            FirebaseFirestoreService.update('/users', passengerId, {
              historyRides: arrayUnion(rideDetails.rideId),
            }),
          );
        });
      }

      await Promise.all(comboRemoveRideCall);

      dispatch(userActions.removeActiveRide(rideDetails.rideId));
      dispatch(userActions.addHistoryRide(rideDetails.rideId));
      dispatch(httpActions.requestSuccess('Ride canceled.'));

      return rideDetails;
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);

// TODO: perhaps populate history state at the same time?
// UPDATE: currently only fetching history on first load
export const getRidesState = createAsyncThunk(
  'rides/getRidesState',
  // rideIds: string[]
  // userType?: 'driver' | 'passenger'
  async ({ rideIds, userType }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
      const ridesResponse = await Promise.all(
        rideIds.map(rideId =>
          FirebaseFirestoreService.get('/rides', [
            where('rideId', '==', rideId),
          ]),
        ),
      );
      const flatenedRidesResponse = ridesResponse.map(ride => ride[0]);
      const activeDriversResponse = await Promise.all(
        flatenedRidesResponse.map(driver =>
          FirebaseFirestoreService.get('/users', [
            where('userId', '==', driver.driverId),
          ]),
        ),
      );

      const ridesAndDrivers = addDriverToRide(
        flatenedRidesResponse,
        activeDriversResponse,
      );

      dispatch(httpActions.requestSuccess());
      return { ridesAndDrivers, userType };
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);

export const getFilteredRides = createAsyncThunk(
  'rides/getFilteredRides',
  async ({ searchPreferences }, { dispatch }) => {
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
        if (searchPreferences[propertyNames[index]]) {
          queryParams.push(
            where(param, '==', searchPreferences[propertyNames[index]]),
          );
        }
      });

      const ridesResponse = await FirebaseFirestoreService.get(
        '/rides',
        queryParams,
      );

      if (ridesResponse) {
        const updatedRides = await updateRidesWithDriver(ridesResponse);
        dispatch(httpActions.requestSuccess());
        return updatedRides;
      }

      dispatch(httpActions.requestSuccess());
      return null;
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);
