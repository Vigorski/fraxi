import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<header className='header'>
			<Link to='/' className='header__back'>
				b
			</Link>
			<div className='header__current-page'>
				<p>My profile</p>
			</div>
		</header>
	);
};

export default Header;