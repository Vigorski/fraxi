import React, { useEffect, memo, ReactElement, FC, useReducer } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import originIcon from 'assets/icons/pin-origin.svg';
import destinationIcon from 'assets/icons/pin-destination.svg';
import WaypointMarkers from './WaypointMarkers';
import PlaceInfoWindow from './PlaceInfoWindow';
import {
  getDirections,
  formattedRouteDistanceAndDuration,
} from 'utilities/map';
import { getUsersList } from 'utilities/shared/getUsersList';
import {
  initialMapState,
  MapActionTypes,
  mapReducer,
} from 'utilities/map/mapReducer';
import {
  CachedWaypointInfo,
  DirectionsResult,
  DirectionsWaypoint,
  Place,
  Route,
  Waypoint,
} from 'types/map';
import { mapLightTheme } from 'utilities/constants/mapLightTheme';

interface MapOwnProps extends Route {
  children: ReactElement;
  parentsCallback?: (args: Route) => void;
}

const Map: FC<MapOwnProps> = ({
  children,
  origin,
  destination,
  waypoints,
  parentsCallback,
}) => {
  const [state, dispatch] = useReducer(mapReducer, initialMapState);
  const { selectedMarker, directions, distance, duration, cachedWaypointsInfo } =
    state;

  const macedoniaBounds = {
    latLngBounds: {
      north: 43,
      south: 40,
      east: 23.6,
      west: 20,
    },
    strictBounds: true,
  };

  const handleMarkerClick = (waypoint: Waypoint) => {
    const cachedWaypointInfo = cachedWaypointsInfo.find(
      cwp => cwp.formatted_address === waypoint.formatted_address,
    );

    if (cachedWaypointInfo) {
      dispatch({
        type: MapActionTypes.SET_SELECTED_MARKER,
        payload: cachedWaypointInfo,
      });
    } else {
      const waypointDirectionsCallback = async (result: DirectionsResult) => {
        const [totalDistanceInKm, totalFormattedDuration] =
          formattedRouteDistanceAndDuration(result.routes[0].legs);
        const passenger = await getUsersList([waypoint.userId]);
        const { name, surname } = passenger[0];
        const waypointDirectionsData: CachedWaypointInfo = {
          ...waypoint,
          totalDistanceInKm,
          totalFormattedDuration,
          fullname: name + ' ' + surname,
        };

        dispatch({
          type: MapActionTypes.ADD_CACHED_WAYPOINT,
          payload: waypointDirectionsData,
        });
        dispatch({
          type: MapActionTypes.SET_SELECTED_MARKER,
          payload: waypointDirectionsData,
        });
      };

      getDirections({
        origin,
        destination: { formatted_address: waypoint.formatted_address } as Place,
        callback: waypointDirectionsCallback,
      });
    }
  };

  const closeInfoWindow = () => {
    return dispatch({
      type: MapActionTypes.SET_SELECTED_MARKER,
      payload: undefined,
    });
  };

  useEffect(() => {
    if (origin && destination) {
      const directionsCallback = (result: DirectionsResult) => {
        const [totalDistanceInKm, totalFormattedDuration] =
          formattedRouteDistanceAndDuration(result.routes[0].legs);

        dispatch({
          type: MapActionTypes.SET_DISTANCE,
          payload: totalDistanceInKm,
        });
        dispatch({
          type: MapActionTypes.SET_DURATION,
          payload: totalFormattedDuration,
        });
        dispatch({ type: MapActionTypes.SET_DIRECTIONS, payload: result });
        parentsCallback && parentsCallback({ origin, destination, waypoints });
      };

      const directionsWaypoints: DirectionsWaypoint[] =
        waypoints?.map(waypoint => ({
          location: waypoint.location,
          stopover: waypoint.stopover,
        })) || [];

      getDirections({
        origin,
        destination,
        waypoints: directionsWaypoints,
        callback: directionsCallback,
      });
    }
  }, [origin, destination, waypoints, parentsCallback]);

  return (
    <>
      {/*
				The purpose of children is to insert input fields and handle directions and waypoints.
				It gives the advantage of passing props directly from the Map to children,
				but it is not being used at the moment.
				This can be removed from Map and placed as a sibling to it for greater flexibility 
				in terms of the elements position.
			*/}
      {children && React.cloneElement(children, { testProp: 'test-prop' })}

      <div className="map__wrapper">
				<GoogleMap
					onClick={closeInfoWindow}
					mapContainerStyle={{ width: '100%', height: '500px' }}
					center={ origin?.location ?? { lat: 41.6, lng: 21.7 }}
					zoom={8}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
						gestureHandling: 'cooperative',
						restriction: macedoniaBounds,
						styles: mapLightTheme,
					}}>
					{origin && (
						<Marker position={origin.location} icon={{ url: originIcon }} />
					)}
					{destination && (
						<Marker position={destination.location} icon={{ url: destinationIcon }} />
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
									strokeColor: '#101010',
									strokeOpacity: 0.8,
									strokeWeight: 3,
								},
								suppressMarkers: true,
							}}
						/>
					)}
				</GoogleMap>
				{directions && (
					<div className="map__distance">
						<p>{distance} / {duration}</p>
					</div>
				)}
			</div>
    </>
  );
};

export default memo(Map);
