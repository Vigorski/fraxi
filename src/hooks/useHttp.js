import { useReducer, useCallback } from 'react';

const httpReducer = (state, action) => {
	switch (action.type) {
		case 'SEND':
			return {
				data: null,
				error: null,
				status: 'pending',
			};
		case 'SUCCESS':
			return {
				data: action.responseData,
				error: null,
				status: 'completed',
			};
		case 'ERROR':
			return {
				data: null,
				error: action.errorMessage,
				status: 'completed',
			};
		default:
			return state;
	}
};

const useHttp = (startWithPending = false, returnData = false) => {
	const [httpState, dispatch] = useReducer(httpReducer, {
		status: startWithPending ? 'pending' : null,
		error: null,
		data: null,
	});

	const handleRequest = useCallback(async (requestDetails, requestCallback) => {
    let responseData = null;
		dispatch({ type: 'SEND' });

		try {
			responseData = await requestCallback(requestDetails);
			dispatch({ type: 'SUCCESS', responseData });
		} catch (err) {
			dispatch({ type: 'ERROR', errorMessage: err.message || 'Something went wrong!' });
		}

		if (returnData) {
      return responseData;
		}
	}, [returnData]);

	return { ...httpState, handleRequest };
};

export default useHttp;
