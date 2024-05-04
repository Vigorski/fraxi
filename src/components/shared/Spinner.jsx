const Spinner = ({ message }) => {
  return (
    <div className="spinner-loader">
      <div className="spinner-loader__overlay" />
      <div className="spinner-loader__inner"></div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Spinner;
