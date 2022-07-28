import { Link } from 'react-router-dom';

import { IconBack } from '../icons';

const Header = () => {
	return (
		<header className='header'>
			<Link to='.' className='header__back'>
				<IconBack />
			</Link>
			{/* <button onClick={history.goBack} className='btn-stripped header__back'>
				<IconBack />
			</button> */}
			<h4 className='header__current-page'>My profile</h4>
		</header>
	);
};

export default Header;