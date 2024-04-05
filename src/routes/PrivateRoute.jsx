import { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routeActions } from 'store/routes/routeSlice';
import { LOGIN, MY_PROFILE } from 'utilities/constants/routesConfig';

export const PrivateRoute = ({
  component: Component,
  roles,
  user,
  pathDetails,
  ...rest
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(routeActions.changeCurrentRoute(pathDetails));
  }, [dispatch, pathDetails]);

  return (
    <Route
      {...rest}
      render={props => {
        if (!user.isLoggedIn) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: LOGIN.path, state: { from: props.location } }}
            />
          );
        } else {
          // check if route is restricted by role
          if (roles && roles.indexOf(user.userDetails.userType) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: MY_PROFILE.path }} />;
          }

          // authorised so return component
          return <Component {...props} />;
        }
      }}
      exact
    />
  );
};
