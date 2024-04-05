const routeDistanceAndDuration = legs => {
  return legs.reduce(
    (accumulator, currentLeg) => ({
      totalDistance: accumulator.totalDistance + currentLeg.distance.value,
      totalDuration: accumulator.totalDuration + currentLeg.duration.value,
    }),
    { totalDistance: 0, totalDuration: 0 },
  );
};

const formatDuration = durationInSeconds => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  return `${hours} hours ${minutes} mins`;
};

export const formattedRouteDistanceAndDuration = legs => {
  const { totalDistance, totalDuration } = routeDistanceAndDuration(legs);
  const totalDistanceInKm = `${Math.floor(totalDistance / 1000)} km`;
  const totalFormattedDuration = formatDuration(totalDuration);

  return [totalDistanceInKm, totalFormattedDuration];
};
