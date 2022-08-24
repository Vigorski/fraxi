import { getFB } from './firebase-api';

export const makeRequest = async requestDetails => {
	const response = await fetch(requestDetails.url, {
		method: requestDetails.method || 'GET',
		body: requestDetails.body ? JSON.stringify(requestDetails.body) : null,
		headers: requestDetails.headers || { 'Content-Type': 'application/json' },
	});
	
  const data = await response.json();
  
	if (!response.ok) {
    throw new Error(data.message);
	}

  return data;
};

export const getUsers = async users => {
	try {
		const comboUsersCall = users.map(userId => getFB(`/users`, { userId }, ['userId']));

		const usersFull = await Promise.all(comboUsersCall);
		const usersSpread = usersFull.map(user => user[0]);

		return usersSpread;
	} catch (err) {
		console.log(err);
	}
} 