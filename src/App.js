import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';

import Login from './pages/auth/Login';
import MyProfile from './pages/user/MyProfile';
import { PrivateRoute } from './components/shared/Routes';
import NotFound from './components/shared/NotFount';

import { userRelogin } from './store/user/userActions';
import { httpActions } from './store/http/httpSlice';

import { authRouteGroup, profileRouteGroup, passengerRouteGroup, driverRouteGroup } from './utilities/constants/routeGroups';
import { LOGIN, REGISTER, MY_PROFILE } from './utilities/constants/routes';

function App() {
	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const { isLoggedIn, userDetails } = useSelector(state => state.user);

	const isAuthPage = location.pathname === LOGIN.path || location.pathname === REGISTER.path;

	const routesCombined = useMemo(() => [
		...profileRouteGroup,
		...passengerRouteGroup,
		...driverRouteGroup
	], []);
	
	useEffect(() => {
		if (!isLoggedIn) {
			const isLoggedInLocalState = JSON.parse(localStorage.getItem('loggedUser'));
			
			if(isLoggedInLocalState !== null) {
				dispatch(userRelogin(isLoggedInLocalState))
			} 
			// else if (!isAuthPage) {
			// 	history.replace(LOGIN.path);
			// }
		} 
		// else if (isAuthPage) {
		// 	history.replace(MY_PROFILE.path);
		// }
	}, [dispatch, history, isAuthPage, isLoggedIn])

	useEffect(() => { // not sure if this is the correct way to nullify http statuses
		dispatch(httpActions.requestReset());
  }, [location, dispatch]);

	console.log(routesCombined)

	return (
		<Switch>
			{/* <Route exact path="/">
				{isLoggedIn ? <Redirect to={MY_PROFILE.path} /> : <Login />}
			</Route> */}
			{/* <PrivateRoute path='/' component={MyProfile} user={{isLoggedIn, userDetails}} /> */}

			{authRouteGroup.map((route) => {
				return <Route key={route.path} {...route} exact />
			})}

			{routesCombined.map((route) => {
				return <PrivateRoute key={route.path} user={{isLoggedIn, userDetails}} {...route} />
			})}

			<Route path={'*'}>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default App;
