type DateArg = number | string | Date;

export const addTime = (
  [h = 0, m = 0, s = 0],
  startingTime = Date.now(),
): number => {
  const newTime = startingTime + h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000;
  return newTime;
};

export const getTime = (time: DateArg): string => {
  const ms = new Date(time);
  let currentHours = ms.getHours().toString();
  let currentMinutes = ms.getMinutes().toString();

  if (currentMinutes.length === 1) {
    currentMinutes = '0' + currentMinutes;
  }

  return `${currentHours}:${currentMinutes}`;
};

export const getDate = (date: DateArg): string => {
  const ms = new Date(date);
  return `${ms.getDate()} ${ms.toLocaleString('default', { month: 'long' })}`;
};

export const getShortDate = (date: DateArg): string => {
  const ms = new Date(date);
  return `${ms.getDate()} ${ms.toLocaleString('default', { month: 'short' })}`;
};
