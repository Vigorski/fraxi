import { NavLink } from 'react-router-dom';
import { IconUser, IconBriefcase, IconEarth } from 'components/icons';
import {
	CREATE_RIDE,
  MY_PROFILE,
  SEARCH_RIDES,
  USERS_OWN_ACTIVE_RIDES,
} from 'utilities/constants/routesConfig';
import { USER_TYPES } from 'types/auth';
import { FC } from 'react';
import { useAppSelector } from 'hooks/useAppSelector';

const Footer: FC = () => {
  const { userDetails } = useAppSelector(state => state.user);

  return (
    <footer className="footer">
      <nav className="footer__nav">
        <ul className="inline-list">
          <li>
            <NavLink
              to={MY_PROFILE.path}
              className={({ isActive }) => (isActive ? 'active' : '')}>
              <IconUser />
            </NavLink>
          </li>
					<li className='footer__create-search-ride'>
						<NavLink
							to={userDetails?.userType === USER_TYPES.passenger ? SEARCH_RIDES.path : CREATE_RIDE.path}
							className={({ isActive }) => (isActive ? 'active' : '')}>
							<IconEarth />
						</NavLink>
					</li>
          <li>
            <NavLink
              to={USERS_OWN_ACTIVE_RIDES.path}
              className={({ isActive }) => (isActive ? 'active' : '')}>
              <IconBriefcase />
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
