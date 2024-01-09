export const addTime = ([ h = 0, m = 0, s = 0 ], startingTime = Date.now()) => {
  const newTime = startingTime + (h * 60 * 60 * 1000) + (m * 60 * 1000) + (s * 1000);
	return newTime;
};


export const getTime = (time) => {
  const ms = new Date(time);
  let currentHours = ms.getHours();
  let currentMinutes = ms.getMinutes();

  if (currentMinutes.toString().length === 1) {
    currentMinutes = "0" + currentMinutes;
  }

  return `${currentHours}:${currentMinutes}`;
}

export const getShortDate = (date) => {
  const ms = new Date(date);
  return `${ms.getDate()} ${ms.toLocaleString('default', {month: 'short'})}`;
}