export const addTime = ([ h = 0, m = 0, s = 0 ], startingTime = Date.now()) => {
  const newTime = startingTime + (h * 60 * 60 * 1000) + (m * 60 * 1000) + (s * 1000);
	return newTime;
};
