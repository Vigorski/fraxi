import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getAndStoreUserData } from 'store/user/userAsyncActions';
import { userActions } from 'store/user/userSlice';
import FirebaseAuthService from 'services/FirebaseAuthService';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const isRegistering = useSelector(state => state.user.isRegistering);

  useEffect(() => {
    const authObserverCallback = user => {
      if (user) {
        // prevent from fetching user data if
        // hasn't logged in yet or
        // still in the process of registering 
        if(!isLoggedIn && !isRegistering) {
          dispatch(getAndStoreUserData(user.uid));
        }
      } else {
        // after finally determined user state, turn isLoggedIn to false
        if(isLoggedIn === null) dispatch(userActions.removeLoggedUser());
      }
    };
    
    const unsubscribe = FirebaseAuthService.authObserver(authObserverCallback);
    
    return () => unsubscribe();
  }, [dispatch, isLoggedIn, isRegistering]);

  if (isLoggedIn === null) return null;

  return children;
};

export default ProtectedRoute;