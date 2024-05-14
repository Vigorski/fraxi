import GoogleMaps from 'services/GoogleMaps';

const getDirections = ({ origin, destination, waypoints, callback }) => {
  const directionsService = GoogleMaps.getInstance().directionsService;

  if (!origin || !origin.formatted_address) {
    throw new Error('Origin point is missing or invalid');
  }

  if (!destination || !destination.formatted_address) {
    throw new Error('Destination point is missing or invalid');
  }

  directionsService.route(
    {
      origin: origin?.formatted_address,
      destination: destination?.formatted_address,
      waypoints: waypoints?.length ? waypoints : [],
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        callback(result);
      } else {
        console.error(`Error fetching directions ${result}`);
      }
    },
  );
};

export default getDirections;
