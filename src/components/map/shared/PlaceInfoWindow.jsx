import { InfoWindow } from '@react-google-maps/api';
import { IconCity, IconDeparture, IconRoute } from 'components/icons';

const PlaceInfoWindow = ({ selectedMarker, handleInfoWindowClose }) => (
  <InfoWindow
    position={selectedMarker.location}
    onCloseClick={handleInfoWindowClose}
    options={{ headerContent: selectedMarker.fullname }}>
    <div className="info-window__content">
      <div className="info-window__main">
        <div className="info-window__title">
          <IconCity />
          <h6>Location</h6>
        </div>
        <p className="info-window__body">{selectedMarker.formatted_address}</p>
      </div>
      <div className="info-window__footer">
        <div className="info-window__estimations">
          <div className="info-window__title">
            <IconDeparture />
            <h6>ETA</h6>
          </div>
          <p className="info-window__body">
            {selectedMarker.totalFormattedDuration}
          </p>
        </div>
        <div className="info-window__estimations">
          <div className="info-window__title">
            <IconRoute />
            <h6>Distance</h6>
          </div>
          <p className="info-window__body">
            {selectedMarker.totalDistanceInKm}
          </p>
        </div>
      </div>
    </div>
  </InfoWindow>
);

export default PlaceInfoWindow;
