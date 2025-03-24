import { useEffect } from 'react';
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
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const { isLoggedIn, userDetails } = useAppSelector((state) => state.user);
  const { status, message } = useAppSelector((state) => state.http);

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
            rideStatus: 'activeRides',
          })
        ).unwrap();

        await dispatch(
          getRidesState({
            rideIds: userDetails.historyRides,
            rideStatus: 'historyRides',
          })
        ).unwrap();
      }
    };

    fetchAllRides();
  }, [dispatch, userDetails]);

  useEffect(() => {
    if (status === HTTP_REQUEST_STATUS.fullfilled && message) {
      toast.success(message);
    } else if (status === HTTP_REQUEST_STATUS.rejected && message) {
      toast.error(message);
    }
  }, [status, message]);

  return (
    <ProtectedRoute>
      <>
        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route
              path="/"
              element={<Navigate to={isLoggedIn ? MY_PROFILE.path : LOGIN.path} />}
            />
            {authRouteGroup.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<AuthRoute isLoggedIn={!!isLoggedIn} {...route} />}
              />
            ))}
            {routesCombined.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PrivateRoute user={{ isLoggedIn, userDetails }} {...route} />}
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
          hideProgressBar
        />
      </>
    </ProtectedRoute>
  );
}

export default App;