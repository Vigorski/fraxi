import { Route, Redirect } from 'react-router-dom';
import { MY_PROFILE } from 'utilities/constants/routesConfig';

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