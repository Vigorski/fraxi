const Spinner = ({ message }) => {
  return (
    <div className="spinner-loader">
      <span className="spinner-loader__inner"></span>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Spinner;
