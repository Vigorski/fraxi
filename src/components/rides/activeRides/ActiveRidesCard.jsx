import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RIDE_DETAILS } from 'utilities/constants/routesConfig';
import { getTime, getDate } from 'utilities/helpers';
import { itemVariants } from 'utilities/constants/framerVariants';

const ActiveRidesCard = ({ activeRides }) =>
  activeRides.map(ride => {
    return (
      <motion.div variants={itemVariants} key={ride.rideId}>
        <Link
          to={{
            pathname: `${RIDE_DETAILS.path}/${ride.rideId}`,
            state: { rideDetails: ride },
          }}
          className="card card--dark card--stats">
          <div className="card__header card__decorated card__decorated--active">
            <p>{ride.route.origin.address_components.city ?? 'N/A'}</p>
            <div className="card__decorated-dash" />
            <i className="icon-car-ride icon-md" />
            <div className="card__decorated-dash" />
            <p>{ride.route.destination.address_components.city ?? 'N/A'}</p>
          </div>
          <div className="card__body">
            <div className="card__section card__radius--bottom">
              <dl className="list-desc__columns list-desc--sm">
                <div className="list-desc__col text-center">
                  <dt>Passengers</dt>
                  <dd>{`${ride.passengers.length} of ${ride.maxPassengers}`}</dd>
                </div>
                <div className="list-desc__col text-center">
                  <dt>Departure</dt>
                  <dd>{`${getDate(ride.departureDate) ?? 'N/A'}`}</dd>
                  <dd>{`${getTime(ride.departureDate) ?? 'N/A'}`}</dd>
                </div>
                <div className="list-desc__col text-center">
                  <dt>Price</dt>
                  <dd>{`$${ride.price}`}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  });

export default ActiveRidesCard;
