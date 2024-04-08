import { ridesActions } from 'store/rides/ridesSlice';
import { httpActions } from 'store/http/httpSlice';
import { userActions } from './userSlice';
import FirebaseAuthService from 'services/FirebaseAuthService';

export const userLogout = () => {
  return async dispatch => {
    try {
      await FirebaseAuthService.signOut();
      dispatch(userActions.removeLoggedUser());
      dispatch(ridesActions.resetRides());
    } catch (error) {
      console.error(error.message);
      dispatch(
        httpActions.requestError(error.message || 'Error while signing out.'),
      );
    }
  };
};
