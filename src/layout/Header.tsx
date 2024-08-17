import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBack } from 'components/icons';
import { MY_PROFILE } from 'utilities/constants/routesConfig';
import { useTypedSelector } from 'hooks/useTypedSelector';
import fraxiLogo from '../assets/logo/fraxi-logo-primary.png';

const Header: FC = () => {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const currentRoute = useTypedSelector(state => state.route.currentRoute);
  const isHomepage = currentRoute?.path === MY_PROFILE.path;

  return (
    <header className="header">
      {isHomepage ? (
        <div className="branding">
          <div className="branding__logo">
            <img src={fraxiLogo} alt="fraxi logo" />
          </div>
        </div>
      ) : (
        <button onClick={handleGoBack} className="btn-link header__back">
          <IconBack />
        </button>
      )}
      <h4 className="header__current-page">{currentRoute?.title}</h4>
    </header>
  );
};

export default Header;
