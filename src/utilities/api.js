export const makeRequest = async requestDetails => {
	const response = await fetch(requestDetails.url, {
		method: requestDetails.method || 'GET',
		body: requestDetails.body ? JSON.stringify(requestDetails.body) : null,
		headers: requestDetails.headers || { 'Content-Type': 'application/json' },
	});
	
  const data = await response.json();

	console.log(data)
  
	if (!response.ok) {
    throw new Error(data.message);
	}

  return data;
};