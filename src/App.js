import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RouteResults from './pages/RouteResults';
import MyProfile from './pages/user/MyProfile';
import EditMyProfile from './pages/user/EditMyProfile';
import EditMyPreferences from './pages/user/EditMyPreferences';
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
	
	if (!isLoggedIn) { // TODO: rework this contition
		const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
		
		if(loggedUser !== null) {
			dispatch(userRelogin(loggedUser))
		}
	}
	
	if (!isLoggedIn && !isAuthPage) {
		history.replace(LOGIN);
	}

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
			<Route path={'*'}>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default App;
