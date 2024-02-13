import { useSelector } from 'react-redux';
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({children}) => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <div className="container">
      {isLoggedIn && <Header />}
      <main>
        {children}
      </main>
      {isLoggedIn && <Footer />}
    </div>
  );
}

export default Layout;