import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IconBack } from '../icons';
import { MY_PROFILE } from '../../utilities/constants/routes';

const Header = () => {
	const currentRoute = useSelector(state => state.route.currentRoute);

	return (
		<header className='header'>
			<Link to={MY_PROFILE.path} className='header__back'>
				<IconBack />
			</Link>
			<h4 className='header__current-page'>{currentRoute?.title}</h4>
		</header>
	);
};

export default Header;