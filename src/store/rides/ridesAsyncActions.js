import { v4 as uuidv4 } from 'uuid';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { userActions } from 'store/user/userSlice';
import { httpActions } from 'store/http/httpSlice';
import { DRIVER, PASSENGER } from 'utilities/constants/users';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { where } from 'firebase/firestore';

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
    numOfStops: 0,
    status: 'active',
  };
};

const addDriverToRide = (rides, drivers) => {
  const updatedRides = rides.map(ride => {
    // using the first index of the response since it always returns an array which will only have a single item
    const driverDetails = drivers.find(
      driver => driver[0].userId === ride.driverId,
    );
    return { ...ride, driverDetails: driverDetails[0] };
  });

  return updatedRides;
};

export const addNewRide = createAsyncThunk(
  'rides/addNewRide',
  async ({ driver, route, values }, { dispatch }) => {
    dispatch(httpActions.requestSend());

    try {
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

      if (userDetails.userType === PASSENGER) {
        comboRemoveRideCall.push(
          FirebaseFirestoreService.update('/rides', rideDetails.rideId, {
            passengers: arrayRemove(userDetails.userId),
            'route.waypoints': waypoints,
          }),
        );
      }

      if (userDetails.userType === DRIVER) {
        comboRemoveRideCall.push(
          FirebaseFirestoreService.update('/rides', rideDetails.rideId, {
            status: 'canceled',
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
      dispatch(httpActions.requestSuccess('Ride successfully canceled.'));

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
export const getRidesState = createAsyncThunk(
  'rides/getRidesState',
  async ({ userRides, ridesMethod }, { dispatch }) => {
    // first arg -> ride data
    // second arg -> which ride method to be used (active or history)
    dispatch(httpActions.requestSend());

    try {
      const ridesResponse = await Promise.all(
        userRides.map(rideId =>
          FirebaseFirestoreService.get('/rides', [where('rideId', '==', rideId)]),
        ),
      );
      const spreadRidesResponse = ridesResponse.map(ride => ride[0]);
      const activeDriversResponse = await Promise.all(
        spreadRidesResponse.map(driver =>
          FirebaseFirestoreService.get('/users', [
            where('userId', '==', driver.driverId),
          ]),
        ),
      );
      const updatedRides = addDriverToRide(
        spreadRidesResponse,
        activeDriversResponse,
      );

      dispatch(httpActions.requestSuccess());
      return { ridesMethod, updatedRides };
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
      // TODO: make additional conditional filters for less important aspects
      // TODO: if too few results, remove some filters
      const uniqueDriverIds = [];
      const fullDBPaths = [
        'route.destination.address_components.city',
        'route.origin.address_components.city',
        'rideType',
        'smoking',
      ];
      const propertyNames = ['destination', 'origin', 'rideType', 'smoking'];
      const queryParams = fullDBPaths.map((param, index) => {
        return where(param, '==', searchPreferences[propertyNames[index]]);
      });
      const ridesResponse = await FirebaseFirestoreService.get(
        '/rides',
        queryParams,
      );

      for (const ride of ridesResponse) {
        if (uniqueDriverIds.indexOf(ride.driverId) === -1) {
          uniqueDriverIds.push(ride.driverId);
        }
      }

      const driversResponse = await Promise.all(
        uniqueDriverIds.map(driverId =>
          FirebaseFirestoreService.get('/users', [where('userId', '==', driverId)]),
        ),
      );
      const updatedRides = addDriverToRide(ridesResponse, driversResponse);

      dispatch(httpActions.requestSuccess());
      return updatedRides;
    } catch (err) {
      console.error(err);
      dispatch(
        httpActions.requestError(err.message || 'Something went wrong!'),
      );
    }
  },
);
