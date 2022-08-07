import { Route, Redirect } from 'react-router-dom';

import { LOGIN } from '../../utilities/constants/routes';

export const PrivateRoute = ({ component: Component, roles, user, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			if (!user.isLoggedIn) {
				// not logged in so redirect to login page with the return url
				return <Redirect to={{ pathname: LOGIN.path, state: { from: props.location } }} />;
			}

			console.log(props, user.isLoggedIn, user.userDetails.userType)
			// check if route is restricted by role
			if (roles && roles.indexOf(user.userDetails.userType) === -1) {
				// role not authorised so redirect to home page
				return <Redirect to={{ pathname: '/' }} />;
			}

			// authorised so return component
			return <Component {...props} />;
		}}
	/>
);
