import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import { AuthRoute, PrivateRoute } from './components/shared/Routes';
import NotFound from './components/shared/NotFount';

import { userRelogin } from './store/user/userAsyncActions';
import { httpActions } from './store/http/httpSlice';
import { getRidesState } from './store/rides/ridesAsyncActions';

import { authRouteGroup, profileRouteGroup, passengerRouteGroup, driverRouteGroup, ridesRouteGroup } from './utilities/constants/routeGroups';
import { LOGIN, MY_PROFILE } from './utilities/constants/routes';

function App() {
	const location = useLocation();
	const dispatch = useDispatch();
	const { isLoggedIn, userDetails } = useSelector(state => state.user);
	const isLoggedInLocalStorage = JSON.parse(localStorage.getItem('loggedUser'));

	const [isFirstLoad, setIsFirstLoad] = useState(false);

	const routesCombined = [
		...passengerRouteGroup,
		...driverRouteGroup,
		...profileRouteGroup,
		...ridesRouteGroup
	];
	
	useEffect(() => {
		const relogin = async () => {
			await dispatch(userRelogin(isLoggedInLocalStorage))
				.then(res => {
					// setSubmitting(false);
				});
		}

		if(isLoggedInLocalStorage !== null) {
			relogin();
		}
	}, [dispatch, isLoggedInLocalStorage])

	useEffect(() => {
		const populateActiveRides = async () => {
			if (!isFirstLoad && userDetails !== undefined && userDetails !== null) {
				await dispatch(getRidesState({ userRides: userDetails.activeRides, ridesMethod: 'activeRides' })).unwrap();
				setIsFirstLoad(true);
			}
		}

		populateActiveRides();
	}, [dispatch, userDetails, isFirstLoad]);


	useEffect(() => { // not sure if this is the correct way to nullify http statuses
		dispatch(httpActions.requestReset());
  }, [location, dispatch]);
	
	return (
		<Switch>
			<Route path="/" exact>
				<Redirect to={isLoggedIn ? MY_PROFILE.path : LOGIN.path} />
			</Route>

			{authRouteGroup.map((route) => {
				return <AuthRoute key={route.path} isLoggedIn={isLoggedIn} {...route} />
			})}

			{routesCombined.map((route) => {
				return <PrivateRoute key={route.path} user={{isLoggedIn, userDetails, isLoggedInLocalStorage: isLoggedInLocalStorage}} {...route} />
			})}

			<Route path={'*'}>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default App;
