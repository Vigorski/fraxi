import GoogleMaps from 'services/GoogleMaps';
import {
  DirectionsResult,
  DirectionsStatus,
  DirectionsWaypoint,
  Place,
} from 'types/map';

type GetDirectionsArguments = {
  origin: Place;
  destination: Place;
  waypoints?: DirectionsWaypoint[];
  callback: (result: DirectionsResult) => void;
};

export const getDirections = ({
  origin,
  destination,
  waypoints,
  callback,
}: GetDirectionsArguments): void => {
  const directionsService = GoogleMaps.getInstance().directionsService;

  if (!origin || !origin.formatted_address) {
    throw new Error('Origin point is missing or invalid');
  }

  if (!destination || !destination.formatted_address) {
    throw new Error('Destination point is missing or invalid');
  }

  directionsService?.route(
    {
      origin: origin?.formatted_address,
      destination: destination?.formatted_address,
      waypoints: waypoints?.length ? waypoints : [],
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result: DirectionsResult | null, status: DirectionsStatus) => {
      if (result && status === google.maps.DirectionsStatus.OK) {
        callback(result);
      } else {
        console.error(`Error fetching directions ${result}`);
      }
    },
  );
};
