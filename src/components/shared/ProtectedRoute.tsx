import { FC, ReactElement, useEffect } from 'react';
import { getAndStoreUserData } from 'store/user/userAsyncActions';
import { userActions } from 'store/user/userSlice';
import FirebaseAuthService from 'services/FirebaseAuthService';
import { useAppSelector } from 'hooks/useAppSelector';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { User as FirebaseUser } from 'firebase/auth';

type ProtectedRouteOwnProps = {
  children: ReactElement;
};

const ProtectedRoute: FC<ProtectedRouteOwnProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isAuthStateDetermined, isRegistering } = useAppSelector(
    state => state.user,
  );

  useEffect(() => {
    const authObserverCallback = (user: FirebaseUser | null) => {
      // user is logged in firebase auth
      if (user) {
        // fetch user data ONLY if user hasn't been logged in yet (first time login) AND
        // after finished registering process (relevant for oAuth)
        if (!isLoggedIn && !isRegistering) {
          dispatch(getAndStoreUserData(user.uid));
        }
        // user is logged out of firebase auth
      } else {
        // unfreeze routes after logging out
        // auth state is determined to be false
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
