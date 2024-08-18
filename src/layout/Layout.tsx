import { FC, ReactElement } from 'react';
import { useAppSelector } from 'hooks/useAppSelector';
import Footer from './Footer';
import Header from './Header';

type LayoutOwnProps = {
  children: ReactElement;
};

const Layout: FC<LayoutOwnProps> = ({ children }) => {
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);

  return (
    <div className="container">
      {isLoggedIn && <Header />}
      <main>{children}</main>
      {isLoggedIn && <Footer />}
    </div>
  );
};

export default Layout;
