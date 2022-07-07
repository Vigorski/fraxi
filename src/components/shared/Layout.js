import { useSelector } from 'react-redux';

import Footer from "./Footer";
import Header from "./Header";

const Layout = ({children}) => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <>
      {isLoggedIn && <Header />}
      <main>
        <div className="container">
          {children}
        </div>
      </main>
      {isLoggedIn && <Footer />}
    </>
  );
}

export default Layout;