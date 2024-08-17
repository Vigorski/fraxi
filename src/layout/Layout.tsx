import { FC, ReactNode } from 'react';
import { useTypedSelector } from 'hooks/useTypedSelector';
import Footer from './Footer';
import Header from './Header';

type LayoutOwnProps = {
  children: ReactNode;
};

const Layout: FC<LayoutOwnProps> = ({ children }) => {
  const isLoggedIn = useTypedSelector(state => state.user.isLoggedIn);

  return (
    <div className="container">
      {isLoggedIn && <Header />}
      <main>{children}</main>
      {isLoggedIn && <Footer />}
    </div>
  );
};

export default Layout;
