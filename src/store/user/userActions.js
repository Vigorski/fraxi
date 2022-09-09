import { userActions } from './userSlice';
import { ridesActions } from '../rides/ridesSlice';
import { LOGIN } from '../../utilities/constants/routes';

export const userLogout = (history) => {
	return (dispatch) => {
		dispatch(userActions.removeLoggedUser());
		dispatch(ridesActions.resetRides())
		localStorage.removeItem('loggedUser');
		history.push(LOGIN.path);
	};
};