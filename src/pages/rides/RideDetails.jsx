import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import RideDetailsPassenger from '../../components/rides/rideDetails/RideDetailsPassenger';
import RideDetailsDriver from '../../components/rides/rideDetails/RideDetailsDriver';
import Layout from 'layout/Layout';
import { USER_TYPES } from 'utilities/constants/userTypes';

const RideDetails = () => {
  // TODO: use the rideId from params to pull ride data from DB
  // TODO: (bug) ride passengers has same number after booking
  const location = useLocation();
  const userDetails = useSelector(state => state.user.userDetails);
  const rideDetails = location.state.rideDetails;
  const isUserPassenger = userDetails.userType === USER_TYPES.passenger;
  const isUserDriver = userDetails.userType === USER_TYPES.driver;

  return (
    <Layout>
      {isUserPassenger && <RideDetailsPassenger rideDetails={rideDetails} />}
      {isUserDriver && <RideDetailsDriver rideDetails={rideDetails} />}
    </Layout>
  );
};

export default RideDetails;
