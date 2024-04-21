import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAndStoreUserData } from 'store/user/userAsyncActions';
import { userActions } from 'store/user/userSlice';
import FirebaseAuthService from 'services/FirebaseAuthService';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, isAuthStateDetermined, isRegistering } = useSelector(state => state.user);

  useEffect(() => {
    const authObserverCallback = user => {
      // user is logged in firebase auth
      if (user) {
        // fetch user data ONLY if user hasn't been logged in yet (first time login) AND
        // after finished registering process (relevant for oAuth)
        if (!isLoggedIn && !isRegistering) {
          dispatch(getAndStoreUserData(user.uid));
        }
      // user is logged out of firebase auth
      } else {
        // turns isLoggedIn to false to display login page
        dispatch(userActions.setIsAuthStateDetermined(true));
      }
    };

    const unsubscribe = FirebaseAuthService.authObserver(authObserverCallback);

    return () => unsubscribe();
  }, [dispatch, isLoggedIn, isRegistering]);

  if (!isAuthStateDetermined) return null;

  return children;
};

export default ProtectedRoute;
