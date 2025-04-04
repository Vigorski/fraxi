import { InfoWindow } from '@react-google-maps/api';
import { IconCar, IconClock, IconRoute } from 'components/icons';
import { FC } from 'react';
import { CachedWaypointInfo } from 'types/map';

type PlaceInfoWindowOwnProps = {
  selectedMarker: CachedWaypointInfo;
  handleInfoWindowClose: () => void;
};

const PlaceInfoWindow: FC<PlaceInfoWindowOwnProps> = ({
  selectedMarker,
  handleInfoWindowClose,
}) => (
  <InfoWindow
    position={selectedMarker.location}
    onCloseClick={handleInfoWindowClose}
    options={{ headerContent: selectedMarker.fullname }}>
    <div className="info-window__content">
      <div className="info-window__main">
				<IconCar />
        <div className="info-window__info">
          <h6>Location</h6>
        	<p>{selectedMarker.formatted_address}</p>
        </div>
      </div>
      <div className="info-window__footer">
        <div className="info-window__estimations">
					<IconClock />
          <div className="info-window__info">
            <h6>ETA</h6>
						<p>{selectedMarker.totalFormattedDuration}</p>
          </div>
        </div>
        <div className="info-window__estimations">
					<IconRoute />
          <div className="info-window__info">
            <h6>Distance</h6>
						<p>{selectedMarker.totalDistanceInKm}</p>
          </div>
        </div>
      </div>
    </div>
  </InfoWindow>
);

export default PlaceInfoWindow;
