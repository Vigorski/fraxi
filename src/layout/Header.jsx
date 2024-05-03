import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconBack } from 'components/icons';

const Header = () => {
  const history = useHistory();
  const currentRoute = useSelector(state => state.route.currentRoute);

  return (
    <header className="header">
      <button onClick={history.goBack} className="btn-link header__back">
        <IconBack />
      </button>
      <h4 className="header__current-page">{currentRoute?.title}</h4>
    </header>
  );
};

export default Header;
