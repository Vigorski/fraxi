import { NavLink } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className='footer'>
			<nav className='footer__nav'>
				<ul className='inline-list'>
					<li>
						<NavLink to='/my-profile' activeClassName='active'>
							user
						</NavLink>
					</li>
					<li>
						<NavLink to='/search' activeClassName='active'>
							search
						</NavLink>
					</li>
					<li>
						<NavLink to='/favorites' activeClassName='active'>
							favs
						</NavLink>
					</li>
					<li>
						<NavLink to='/notifications' activeClassName='active'>
							notes
						</NavLink>
					</li>
				</ul>
			</nav>
		</footer>
	);
};

export default Footer;
