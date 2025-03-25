type RouteDistanceAndDuration = {
  totalDistance: number;
  totalDuration: number;
}

const routeDistanceAndDuration = (legs: google.maps.DirectionsLeg[]) => {
  return legs.reduce(
    (accumulator: RouteDistanceAndDuration, currentLeg) => ({
      totalDistance: accumulator.totalDistance + (currentLeg.distance as google.maps.Distance).value,
      totalDuration: accumulator.totalDuration + (currentLeg.duration as google.maps.Duration).value,
    }),
    { totalDistance: 0, totalDuration: 0 },
  );
};

const formatDuration = (durationInSeconds: number) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  return `${hours} hours ${minutes} mins`;
};

export const formattedRouteDistanceAndDuration = (legs: google.maps.DirectionsLeg[]) => {
  const { totalDistance, totalDuration } = routeDistanceAndDuration(legs);
  const totalDistanceInKm = `${Math.floor(totalDistance / 1000)} km`;
  const totalFormattedDuration = formatDuration(totalDuration);

  return [totalDistanceInKm, totalFormattedDuration];
};
