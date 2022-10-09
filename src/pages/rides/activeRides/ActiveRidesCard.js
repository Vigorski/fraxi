import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { RIDE_DETAILS } from '../../../utilities/constants/routes';
import { getTime, getShortDate } from '../../../utilities/date-time';
import { itemVariants } from '../../../utilities/constants/framerVariants';

const ActiveRidesCard = ({ activeRides }) =>
	activeRides.map(ride => {
		return (
      <motion.div variants={itemVariants} key={ride.rideId}>
        <Link to={{ pathname: `${RIDE_DETAILS.path}/${ride.rideId}`, state: { rideDetails: ride } }} className='card card--dark card--stats'>
          <div className='card__header card__decorated card__decorated--active'>
            <p>{ride.originAbbr ?? 'N/A'}</p>
            <div className='card__decorated-dash' />
            <i className='icon-car-ride icon-md' />
            <div className='card__decorated-dash' />
            <p>{ride.destinationAbbr ?? 'N/A'}</p>
          </div>
          <div className='card__body'>
            <div className='card__section card__radius--bottom'>
              <dl className='list-desc__columns'>
                <div className='list-desc__col text-center'>
                  <dt>Date</dt>
                  <dd>{`${getShortDate(ride.departureDate) ?? 'N/A'}`}</dd>
                </div>
                <div className='list-desc__col text-center'>
                  <dt>Departure</dt>
                  <dd>{`${getTime(ride.departureDate) ?? 'N/A'}`}</dd>
                </div>
                <div className='list-desc__col text-center'>
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
