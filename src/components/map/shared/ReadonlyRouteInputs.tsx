import { FC } from 'react';
import { Place } from 'types/map';

type ReadonlyRouteInputsOwnProps = {
  origin: Place;
  destination: Place;
};

const ReadonlyRouteInputs: FC<ReadonlyRouteInputsOwnProps> = ({
  origin,
  destination,
}) => {
  return (
    <>
      <div className="form-field form-field--disabled form-field__map-input">
        <label htmlFor="origin" className='form-field__origin-label' />
        <input
          type="text"
          id="origin"
          value={origin.formatted_address}
          disabled
        />
      </div>
      <div className="form-field form-field--disabled form-field__map-input">
        <label htmlFor="destination" className='form-field__destination-label' />
        <input
          type="text"
          id="destination"
          value={destination.formatted_address}
          disabled
        />
      </div>
    </>
  );
};

export default ReadonlyRouteInputs;
