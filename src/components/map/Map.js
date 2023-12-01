import { useState, useEffect, useRef, useMemo } from 'react';

function displayRoute(origin, destination, service, display) {
  service
    .route({
      origin,
      destination,
      waypoints: [],
      travelMode: window.google.maps.TravelMode.DRIVING,
      // avoidTolls: true,
    })
    .then((result) => {
      display.setDirections(result);
    })
    .catch((e) => {
      console.log("Could not display directions due to: " + e);
    });
}

function computeTotalDistanceAndDuration(result) {
  let totalDistance = 0;
  let totalDuration = 0;
  const myroute = result.routes[0];

  if (!myroute) {
    return;
  }

  for (let i = 0; i < myroute.legs.length; i++) {
    totalDistance += myroute.legs[i].distance.value;
    totalDuration += myroute.legs[i].duration.value;
  }

  totalDistance = totalDistance / 1000;
  totalDuration = totalDuration / 60 / 60;

  return {
    distance: totalDistance.toFixed(1),
    duration: totalDuration.toFixed(2)
  }
}

const Map = ({center, zoom, originCity = 'Skopje', destinationCity = 'Prilep', storeRouteMapDetails}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState();
  const shouldMapRerender = useRef(false);
  const [origin, setOrigin] = useState(originCity);
  const [destination, setDestination] = useState(destinationCity);
  const [totalDistanceAndDuration, setTotalDistanceAndDuration] = useState({});
  const directionsRendererRef = useRef();
  const directionsService = useMemo(() => new window.google.maps.DirectionsService(), []);
  
  useEffect(() => {
    if (mapRef.current && !map) {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        mapId: process.env.REACT_APP_GOOGLE_MAP_ID,
        language: 'en',
        // disableDefaultUI: true
      });

      setMap(map);

      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        draggable: true,
        map: map
      });
      
      //no need to remove listener here because event is attached only once
      directionsRendererRef.current.addListener("directions_changed", () => {
        const directions = directionsRendererRef.current.getDirections();
        const currentRoute = {
          start_address: directions.routes[0].legs[0].start_address,
          start_location: {
            lat: directions.routes[0].legs[0].start_location.lat(),
            lng: directions.routes[0].legs[0].start_location.lng()
          },
          end_address: directions.routes[0].legs[0].end_address,
          end_location: {
            lat: directions.routes[0].legs[0].end_location.lat(),
            lng: directions.routes[0].legs[0].end_location.lng()
          },
          start_city: null,
          end_city: null,
        }

        if (directions) {
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            {
              location: {
                lat: currentRoute.start_location.lat,
                lng: currentRoute.start_location.lng
              },
              language: 'en'
            },
            function(results, status) {
              const originCity = results[0].address_components.find(component => component.types.includes("locality") || component.types.includes("administrative_area_level_3")).long_name;

              if (status === 'OK') {
                if(!!originCity) {
                  console.log(directions);
                  currentRoute.start_city = originCity;
                } else {
                  // dispatch(httpActions.requestError('Location not supported!'));
                }
              } else {
                console.log('Geocode was not successful for the following reason: ' + status);
              }
            }
          );
          
          // console.log(directions.routes[0].legs[0].end_address)
          storeRouteMapDetails(currentRoute)
          setTotalDistanceAndDuration(computeTotalDistanceAndDuration(directions));
          setOrigin(currentRoute.start_address);
          setDestination(currentRoute.end_address);  
        }
      });

      displayRoute(
        origin,
        destination,
        directionsService,
        directionsRendererRef.current
      );
    }
  }, [map, mapRef, center, zoom, origin, destination, directionsService, storeRouteMapDetails]);

  useEffect(() => {
    if(shouldMapRerender.current) {
      shouldMapRerender.current = false;

      const handler = setTimeout(() => {
        displayRoute(
          origin,
          destination,
          directionsService,
          directionsRendererRef.current
        );
      }, 1000);
  
      return () => {
        clearTimeout(handler);
      };
    }
  }, [origin, destination, directionsService, directionsRendererRef]);

  const handleOriginInput = e => {
    shouldMapRerender.current = true;
    setOrigin(e.target.value)
  }

  const handleDestinationInput = e => {
    shouldMapRerender.current = true;
    setDestination(e.target.value)
  }
  
  return (
    <>
      <div className="form-field">
        <label htmlFor="origin">Origin</label>
        <input type='text' id="origin" value={origin} onChange={handleOriginInput} />
      </div>
      <div className="form-field">
        <label htmlFor="destination">Destination</label>
        <input type='text' id="destination" value={destination} onChange={handleDestinationInput} />
      </div>
      
      <div className="map__wrapper">
        <div className="map__distance">{totalDistanceAndDuration.distance} km / {totalDistanceAndDuration.duration}h</div>
        <div ref={mapRef} id='map' className="map__route" style={{height: '500px'}} />
      </div>
    </>
  );
}

export default Map;