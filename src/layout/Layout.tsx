import { FC, ReactElement } from 'react';
import { useAppSelector } from 'hooks/useAppSelector';
import Footer from './Footer';
import Header from './Header';
import GoogleMapsLoader from 'components/shared/GoogleMapsLoader';

type LayoutOwnProps = {
  children: ReactElement;
};

const Layout: FC<LayoutOwnProps> = ({ children }) => {
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);

  return (
    <div className="container">
      {isLoggedIn && <Header />}
      <GoogleMapsLoader>
        <main>{children}</main>
      </GoogleMapsLoader>
      {isLoggedIn && <Footer />}
    </div>
  );
};

export default Layout;
