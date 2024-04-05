import { LOGIN } from 'utilities/constants/routesConfig';
import { ridesActions } from 'store/rides/ridesSlice';
import { userActions } from './userSlice';

export const userLogout = history => {
  return dispatch => {
    dispatch(userActions.removeLoggedUser());
    dispatch(ridesActions.resetRides());
    localStorage.removeItem('loggedUser');
    history.push(LOGIN.path);
  };
};
