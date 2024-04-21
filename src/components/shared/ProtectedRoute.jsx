import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAndStoreUserData } from 'store/user/userAsyncActions';
import { userActions } from 'store/user/userSlice';
import FirebaseAuthService from 'services/FirebaseAuthService';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const userDetails = useSelector(state => state.user.userDetails);
  const isRegistering = useSelector(state => state.user.isRegistering);

  useEffect(() => {
    const authObserverCallback = user => {
      // user is logged in firebase auth
      if (user) {
        // fetch user data ONLY if user hasn't been logged in yet (first time login) AND
        // after finished registering process (relevant for oAuth)
        if (!userDetails && !isRegistering) {
          dispatch(getAndStoreUserData(user.uid));
        }
      // user is logged out of firebase auth
      } else {
        // turns isLoggedIn to false to display login page
        dispatch(userActions.removeLoggedUser());
      }
    };

    const unsubscribe = FirebaseAuthService.authObserver(authObserverCallback);

    return () => unsubscribe();
  }, [dispatch, userDetails, isRegistering]);

  if (isLoggedIn === null) return null;

  return children;
};

export default ProtectedRoute;
