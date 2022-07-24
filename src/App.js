import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RouteResults from './pages/RouteResults';
import MyProfile from './pages/user/MyProfile';
import EditMyProfile from './pages/user/EditMyProfile';
import EditMyPreferences from './pages/user/passenger/EditMyPreferences';
import CreateRide from './pages/user/driver/CreateRide';
import NotFound from './components/shared/NotFount';

import { userRelogin } from './store/user/userActions';
import { httpActions } from './store/http/httpSlice';

import { LOGIN, REGISTER, ROUTE_RESULTS, MY_PROFILE } from './utilities/constants/routes';

function App() {
	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const { isLoggedIn } = useSelector(state => state.user);

	const isAuthPage = location.pathname === LOGIN || location.pathname === REGISTER;
	
	useEffect(() => {
		if (!isLoggedIn) {
			const isLoggedInLocalState = JSON.parse(localStorage.getItem('loggedUser'));
			
			if(isLoggedInLocalState !== null) {
				dispatch(userRelogin(isLoggedInLocalState))
			} else if (!isAuthPage) {
				history.replace(LOGIN);
			}
		}
	}, [dispatch, history, isAuthPage, isLoggedIn])
	

	useEffect(() => { // not sure if this is the correct way to nullify http statuses
		dispatch(httpActions.requestReset());
  }, [location, dispatch]);


	return (
		<Switch>
			<Route path={LOGIN} exact>
				<Login />
			</Route>
			<Route path={REGISTER} exact>
				<Register />
			</Route>
			<Route path={ROUTE_RESULTS} exact>
				<RouteResults />
			</Route>
			<Route path={MY_PROFILE} exact>
				<MyProfile />
			</Route>
			<Route path={`${MY_PROFILE}/edit-user`} exact>
				<EditMyProfile />
			</Route>
			<Route path={`${MY_PROFILE}/edit-preferences`} exact>
				<EditMyPreferences />
			</Route>
			<Route path={`${MY_PROFILE}/create-ride`} exact>
				<CreateRide />
			</Route>
			<Route path={'*'}>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default App;
