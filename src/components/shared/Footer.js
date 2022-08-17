import { NavLink } from 'react-router-dom';

import { MY_PROFILE, SEARCH_RIDES, ACTIVE_RIDES } from '../../utilities/constants/routes';
import { IconUser, IconBell, IconBookmark, IconSearch } from '../icons';

const Footer = () => {
	return (
		<footer className='footer'>
			<nav className='footer__nav'>
				<ul className='inline-list'>
					<li>
						<NavLink to={MY_PROFILE.path} activeClassName='active'>
							<IconUser />
						</NavLink>
					</li>
					<li>
						<NavLink to={SEARCH_RIDES.path} activeClassName='active'>
							<IconSearch />
						</NavLink>
					</li>
					<li>
						<NavLink to={ACTIVE_RIDES.path} activeClassName='active'>
							<IconBookmark />
						</NavLink>
					</li>
					<li>
						<NavLink to='/notifications' activeClassName='active'>
							<IconBell />
						</NavLink>
					</li>
				</ul>
			</nav>
		</footer>
	);
};

export default Footer;
