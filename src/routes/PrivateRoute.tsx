import { FC, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routeActions } from 'store/routes/routeSlice';
import { LOGIN, MY_PROFILE } from 'utilities/constants/routesConfig';
import { Route } from 'types/route';
import { UserState } from 'store/user/userSlice';

type PrivateRouteOwnProps = Omit<Route, 'path'> & { user: UserState };

export const PrivateRoute: FC<PrivateRouteOwnProps> = ({
  user,
  component: Component,
  roles,
  pathDetails,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (pathDetails) {
      dispatch(routeActions.changeCurrentRoute(pathDetails));
    }
  }, [dispatch, pathDetails]);

  const isAuthorized = roles && user.userDetails?.userType && roles.includes(user.userDetails.userType);

  if (!user.isLoggedIn) {
    // if not logged in - redirect to login page
    return <Navigate to={LOGIN.path} />;
  }

  // check if route is restricted by role
  if (!isAuthorized) {
    // if role is not authorised - redirect to home page
    return <Navigate to={MY_PROFILE.path} />;
  }

  // if authorised - return component
  return <Component />;
};
