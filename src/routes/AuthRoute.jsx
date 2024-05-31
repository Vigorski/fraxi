import { Navigate } from 'react-router-dom';
import { MY_PROFILE } from 'utilities/constants/routesConfig';

export const AuthRoute = ({ component: Component, isLoggedIn }) => {
	// if already logged in - redirect to profile page with the return url
	if(isLoggedIn) {
		return <Navigate to={MY_PROFILE.path} />;
	}

	// otherwise return login component
	return <Component />;
};
