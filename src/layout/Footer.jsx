import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IconUser, IconBookmark, IconSearch } from 'components/icons';
import {
  MY_PROFILE,
  SEARCH_RIDES,
  USERS_OWN_ACTIVE_RIDES,
} from 'utilities/constants/routesConfig';
import { USER_TYPES } from 'utilities/constants/userTypes';

const Footer = () => {
  const { userDetails } = useSelector(state => state.user);

  return (
    <footer className="footer">
      <nav className="footer__nav">
        <ul className="inline-list">
          <li>
            <NavLink to={MY_PROFILE.path} className={({ isActive }) => (isActive ? "active" : "")}>
              <IconUser />
            </NavLink>
          </li>
          {userDetails.userType === USER_TYPES.passenger && (
            <li>
              <NavLink to={SEARCH_RIDES.path} className={({ isActive }) => (isActive ? "active" : "")}>
                <IconSearch />
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to={USERS_OWN_ACTIVE_RIDES.path} className={({ isActive }) => (isActive ? "active" : "")}>
              <IconBookmark />
            </NavLink>
          </li>
          {/* <li>
						<NavLink to='/notifications' className={({ isActive }) => (isActive ? "active" : "")}>
							<IconBell />
						</NavLink>
					</li> */}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
