import { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { routeActions } from '../../store/routes/routeSlice';
import { LOGIN, MY_PROFILE } from '../../utilities/constants/routes';

export const PrivateRoute = ({ component: Component, roles, user, pathDetails, ...rest }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(routeActions.changeCurrentRoute(pathDetails));
	}, [dispatch, pathDetails])

	return (
		<Route
			{...rest}
			render={props => {
				if (!user.isLoggedIn && !user.isLoggedInLocalStorage) {
					// not logged in so redirect to login page with the return url
					return <Redirect to={{ pathname: LOGIN.path, state: { from: props.location } }} />;
				}

				if (user.isLoggedIn) {
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

export const AuthRoute = ({ component: Component, isLoggedIn, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			if (isLoggedIn) {
				// already logged in so redirect to profile page with the return url
				return <Redirect to={{ pathname: MY_PROFILE.path, state: { from: props.location } }} />;
			}

			// otherwise return component
			return <Component {...props} />;
		}}
		exact
	/>
);
