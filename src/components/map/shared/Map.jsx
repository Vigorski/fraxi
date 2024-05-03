import React, { useState, useEffect, memo } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import markerIcon from 'assets/icons/marker.svg';
import markerIconUnique from 'assets/icons/marker-unique.svg';
import flagIcon from 'assets/icons/flag.svg';
import { formattedRouteDistanceAndDuration } from 'utilities/map/routeMeasurements';

const WaypointMarkers = ({ waypoints }) => {
  const { userId } = useSelector(state => state.user.userDetails);

  return waypoints.map(waypoint => {
    if (waypoint.userId === userId) {
      return (
        <Marker
          key={waypoint.userId}
          position={waypoint.location}
          icon={{ url: markerIconUnique }}
        />
      );
    }

    return (
      <Marker
        key={waypoint.userId}
        position={waypoint.location}
        icon={{ url: markerIcon }}
      />
    );
  });
};

const Map = ({
  children,
  origin,
  destination,
  waypoints,
  directionsCallback,
}) => {
  // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const macedoniaBounds = {
    latLngBounds: {
      north: 42.41,
      south: 40.7,
      east: 23.1,
      west: 20.4,
    },
    strictBounds: true,
  };

  useEffect(() => {
    if (origin && destination) {
      const recunstructedWaypoints = waypoints.map(waypoint => ({
        location: waypoint.location,
        stopover: waypoint.stopover,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin.formatted_address,
          destination: destination.formatted_address,
          waypoints: recunstructedWaypoints.length
            ? recunstructedWaypoints
            : [],
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const [totalDistanceInKm, totalFormattedDuration] =
              formattedRouteDistanceAndDuration(result.routes[0].legs);

            setDistance(totalDistanceInKm);
            setDuration(totalFormattedDuration);
            setDirections(result);
            directionsCallback &&
              directionsCallback({ origin, destination, waypoints });
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        },
      );
    }
  }, [origin, destination, waypoints, directionsCallback]);

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
          {waypoints && <WaypointMarkers waypoints={waypoints} />}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#585E76',
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

Map.defaultProps = {
  waypoints: [],
};
export default memo(Map);
