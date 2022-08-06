import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SearchRides from './pages/search/SearchRides';
import MyProfile from './pages/user/MyProfile';
import EditMyProfile from './pages/user/EditMyProfile';
import EditMyPreferences from './pages/user/passenger/EditMyPreferences';
import CreateRide from './pages/user/driver/CreateRide';
import NotFound from './components/shared/NotFount';

import { userRelogin } from './store/user/userActions';
import { httpActions } from './store/http/httpSlice';

import { LOGIN, REGISTER, SEARCH_RIDES, MY_PROFILE } from './utilities/constants/routes';

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
		} else if (isAuthPage) {
			history.replace(MY_PROFILE);
		}
	}, [dispatch, history, isAuthPage, isLoggedIn])
	
	// https://stackoverflow.com/questions/58144678/organizing-react-routes-into-separate-components
	// https://betterprogramming.pub/8-basic-and-advanced-react-router-tips-6993ece8f57a

	useEffect(() => { // not sure if this is the correct way to nullify http statuses
		dispatch(httpActions.requestReset());
  }, [location, dispatch]);


	return (
		<Switch>
			<Route path={'/'} exact>
				<MyProfile />
			</Route>
			<Route path={LOGIN} exact>
				<Login />
			</Route>
			<Route path={REGISTER} exact>
				<Register />
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
			<Route path={SEARCH_RIDES} exact>
				<SearchRides />
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
