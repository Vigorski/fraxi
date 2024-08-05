import GoogleMaps from 'services/GoogleMaps';
import { Waypoint } from 'types/map';

type GetDirectionsArguments = {
  origin: google.maps.places.PlaceResult;
  destination: google.maps.places.PlaceResult;
  waypoints?: Waypoint[];
  callback: (result: google.maps.DirectionsResult) => void;
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
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus,
    ) => {
      if (result && status === google.maps.DirectionsStatus.OK) {
        callback(result);
      } else {
        console.error(`Error fetching directions ${result}`);
      }
    },
  );
};
