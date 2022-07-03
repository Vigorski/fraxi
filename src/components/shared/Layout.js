const Layout = ({children}) => {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}

export default Layout;