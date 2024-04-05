import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { AnimatePresence } from 'framer-motion';
import { PrivateRoute } from './routes/PrivateRoute';
import { AuthRoute } from './routes/AuthRoute';
import NotFound from './layout/NotFound';
import { userRelogin } from './store/user/userAsyncActions';
import { getRidesState } from './store/rides/ridesAsyncActions';
import {
  authRouteGroup,
  profileRouteGroup,
  passengerRouteGroup,
  driverRouteGroup,
  ridesRouteGroup,
} from './utilities/constants/routeGroups';
import { LOGIN, MY_PROFILE } from './utilities/constants/routesConfig';
import { FULLFILLED, REJECTED } from './utilities/constants/httpRequestStatus';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, userDetails } = useSelector(state => state.user);
  const { status, message } = useSelector(state => state.http);
  const isLoggedInLocalStorage = JSON.parse(localStorage.getItem('loggedUser'));

  const routesCombined = [
    ...passengerRouteGroup,
    ...driverRouteGroup,
    ...profileRouteGroup,
    ...ridesRouteGroup,
  ];

  useEffect(() => {
    if (isLoggedInLocalStorage !== null) {
      dispatch(userRelogin(isLoggedInLocalStorage));
    }
  }, [dispatch, isLoggedInLocalStorage]);

  useEffect(() => {
    if (userDetails !== undefined && userDetails !== null) {
      dispatch(
        getRidesState({
          userRides: userDetails.activeRides,
          ridesMethod: 'activeRides',
        }),
      );
    }
  }, [dispatch, userDetails]);

  useEffect(() => {
    // TODO: perhaps it would be a better idea to use a toast on each page where its necessary instead of a global toast
    // because currently we get one additional rerender (7 rerenders on first load rather than 3)
    if (status === FULLFILLED && message !== null) {
      toast.success(message);
    } else if (status === REJECTED && message !== null) {
      toast.error(message);
    }
  }, [status, message]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Switch key={location.pathname} location={location}>
          <Route path="/" exact>
            <Redirect to={isLoggedIn ? MY_PROFILE.path : LOGIN.path} />
          </Route>

          {authRouteGroup.map(route => {
            return (
              <AuthRoute key={route.path} isLoggedIn={isLoggedIn} {...route} />
            );
          })}

          {routesCombined.map(route => {
            return (
              <PrivateRoute
                key={route.path}
                user={{
                  isLoggedIn,
                  userDetails,
                  isLoggedInLocalStorage: isLoggedInLocalStorage,
                }}
                {...route}
              />
            );
          })}

          <Route path={'*'}>
            <NotFound />
          </Route>
        </Switch>
      </AnimatePresence>
      <ToastContainer
        limit={3}
        autoClose={2000}
        transition={Slide}
        draggablePercent={50}
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
