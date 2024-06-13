import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { AnimatePresence } from 'framer-motion';
import { PrivateRoute } from 'routes/PrivateRoute';
import { AuthRoute } from 'routes/AuthRoute';
import NotFound from 'layout/NotFound';
import ProtectedRoute from 'components/shared/ProtectedRoute';
import { getRidesState } from 'store/rides/ridesAsyncActions';
import {
  authRouteGroup,
  profileRouteGroup,
  passengerRouteGroup,
  driverRouteGroup,
  ridesRouteGroup,
  errorRouteGroup,
} from 'utilities/constants/routeGroups';
import { LOGIN, MY_PROFILE } from 'utilities/constants/routesConfig';
import { HTTP_REQUEST_STATUS } from 'types/httpRequestStatus';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, userDetails } = useSelector(state => state.user);
  const { status, message } = useSelector(state => state.http);

  const routesCombined = [
    ...passengerRouteGroup,
    ...driverRouteGroup,
    ...ridesRouteGroup,
    ...profileRouteGroup,
    ...errorRouteGroup,
  ];

  useEffect(() => {
    const fetchAllRides = async () => {
      if (userDetails) {
        await dispatch(
          getRidesState({
            rideIds: userDetails.activeRides,
            userType: 'activeRides',
          }),
        ).unwrap();

        await dispatch(
          getRidesState({
            rideIds: userDetails.historyRides,
            userType: 'historyRides',
          }),
        ).unwrap();
      }
    };

    fetchAllRides();
  }, [dispatch, userDetails]);

  useEffect(() => {
    // TODO: perhaps it would be a better idea to use a toast on each page where its necessary instead of a global toast
    // because currently we get one additional rerender (7 rerenders on first load rather than 3)
    if (status === HTTP_REQUEST_STATUS.fullfilled && message !== null) {
      toast.success(message);
    } else if (status === HTTP_REQUEST_STATUS.rejected && message !== null) {
      toast.error(message);
    }
  }, [status, message]);

  return (
    <ProtectedRoute>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? MY_PROFILE.path : LOGIN.path} />
            }
          />

          {authRouteGroup.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<AuthRoute isLoggedIn={isLoggedIn} {...route} />}
            />
          ))}

          {routesCombined.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute
                  user={{
                    isLoggedIn,
                    userDetails,
                  }}
                  {...route}
                />
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <ToastContainer
        limit={3}
        autoClose={2000}
        transition={Slide}
        draggablePercent={50}
        hideProgressBar={true}
      />
    </ProtectedRoute>
  );
}

export default App;
