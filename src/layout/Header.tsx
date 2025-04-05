import { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChevronBack, IconLogo, IconMenu } from 'components/icons';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import { useAppSelector } from 'hooks/useAppSelector';
import SideMenu from './SideMenu';

const Header: FC = () => {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const currentRoute = useAppSelector(state => state.route.currentRoute);
  const isHomepage = currentRoute?.path === MY_PROFILE.path;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(
    (state: boolean) => setIsMenuOpen(state),
    [],
  );

  return (
    <header className="header">
      {isHomepage ? (
        <div className="branding">
          <div className="branding__logo">
            <IconLogo />
          </div>
        </div>
      ) : (
        <button onClick={handleGoBack} className="btn-link header__back">
          <IconChevronBack />
        </button>
      )}
      <h4 className="header__current-page">{currentRoute?.title}</h4>
      <button className="btn-menu" onClick={handleMenuToggle.bind(null, true)}>
        <IconMenu />
      </button>
      <SideMenu isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
    </header>
  );
};

export default Header;
