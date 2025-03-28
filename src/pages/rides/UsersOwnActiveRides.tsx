import ActiveRides from 'components/rides/activeRides/ActiveRides';
import { useAppSelector } from 'hooks/useAppSelector';
import MotionWrapper from 'layout/MotionWrapper';

const UsersOwnActiveRides = () => {
  const { activeRides } = useAppSelector(state => state.rides);

  return (
    <MotionWrapper className="active-rides">
      <div className="card__wrapper">
        <ActiveRides activeRides={activeRides} />
      </div>
    </MotionWrapper>
  );
};

export default UsersOwnActiveRides;
