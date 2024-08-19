import React, { useState, useEffect, memo, useMemo } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import flagIcon from 'assets/icons/flag.svg';
import WaypointMarkers from './WaypointMarkers';
import PlaceInfoWindow from './PlaceInfoWindow';
import {
  getDirections,
  formattedRouteDistanceAndDuration,
} from 'utilities/map';
import { getUsersList } from 'utilities/shared/getUsersList';

const Map = ({ children, origin, destination, waypoints = [], parentsCallback }) => {
  // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const cachedWaypoints = useMemo(() => [], []);

  const macedoniaBounds = {
    latLngBounds: {
      north: 43,
      south: 40,
      east: 23.6,
      west: 20,
    },
    strictBounds: true,
  };

  const handleMarkerClick = waypoint => {
    const cachedWaypoint = cachedWaypoints.find(
      cwp => cwp.formatted_address === waypoint.formatted_address,
    );

    if (cachedWaypoint) {
      setSelectedMarker(cachedWaypoint);
    } else {
      const waypointDirectionsCallback = async result => {
        const [totalDistanceInKm, totalFormattedDuration] =
          formattedRouteDistanceAndDuration(result.routes[0].legs);
				const passenger = await getUsersList([waypoint.userId]);
				const { name, surname }	= passenger[0];
        const waypointDirectionsData = {
          ...waypoint,
          totalDistanceInKm,
          totalFormattedDuration,
					fullname: name + ' ' + surname
        };

        cachedWaypoints.push(waypointDirectionsData);
        setSelectedMarker(waypointDirectionsData);
      };

      getDirections({
        origin,
        destination: waypoint,
        callback: waypointDirectionsCallback,
      });
    }
  };

  const closeInfoWindow = () => setSelectedMarker(null);

  useEffect(() => {
    if (origin && destination) {
      const strippedWaypointsForDirection = waypoints.map(waypoint => ({
        location: waypoint.location,
        stopover: waypoint.stopover,
      }));

      const directionsCallback = result => {
        const [totalDistanceInKm, totalFormattedDuration] =
          formattedRouteDistanceAndDuration(result.routes[0].legs);

        setDistance(totalDistanceInKm);
        setDuration(totalFormattedDuration);
        setDirections(result);
        parentsCallback && parentsCallback({ origin, destination, waypoints });
      };

      getDirections({
        origin,
        destination,
        waypoints: strippedWaypointsForDirection,
        callback: directionsCallback,
      });
    }
  }, [origin, destination, waypoints, parentsCallback]);

  return (
    <>
      {/*
				children is currently used for inserting input fields to handle directions and waypoints.
				It gives the advantage of passing props directly from the Map to children,
				but it is not being used at the moment.
				This can be removed from Map and placed as a sibling to it for greater flexibility 
				in terms of the elements position.
			*/}
      {children && React.cloneElement(children, { testProp: 'test-prop' })}

      <div className="map__wrapper">
        {directions && (
          <div className="map__distance">
            {distance} / {duration}
          </div>
        )}
        <GoogleMap
          onClick={closeInfoWindow}
          mapContainerStyle={{ width: '100%', height: '500px' }}
          center={{ lat: 41.6, lng: 21.7 }}
          zoom={8}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            mapId: process.env.REACT_APP_GOOGLE_MAP_ID,
            gestureHandling: 'greedy',
            restriction: macedoniaBounds,
          }}>
          {origin && (
            <Marker position={origin.location} icon={{ url: flagIcon }} />
          )}
          {destination && (
            <Marker position={destination.location} icon={{ url: flagIcon }} />
          )}
          {waypoints && (
            <WaypointMarkers
              waypoints={waypoints}
              handleMarkerClick={handleMarkerClick}
            />
          )}

          {selectedMarker && (
            <PlaceInfoWindow
              selectedMarker={selectedMarker}
              handleInfoWindowClose={closeInfoWindow}
            />
          )}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#252525',
                  strokeOpacity: 0.8,
                  strokeWeight: 3,
                },
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default memo(Map);
