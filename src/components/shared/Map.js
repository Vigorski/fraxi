import { useState, useEffect, useRef, useMemo } from 'react';

const Map = ({center, zoom, originCity = 'Skopje', destinationCity = 'Prilep', handleRouteMapDetails}) => {
  const ref = useRef(null);
  const [map, setMap] = useState();
  const [origin, setOrigin] = useState(originCity);
  const [destination, setDestination] = useState(destinationCity);
  const [totalDistanceAndDuration, setTotalDistanceAndDuration] = useState({});

  function displayRoute(origin, destination, service, display) {
    service
      .route({
        origin,
        destination,
        // waypoints: [
        //   { location: "Hristo Smirnenski 22, Skopje" }
        // ],
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

  const directionsService = useMemo(() => new window.google.maps.DirectionsService(), []);
  const directionsRenderer =  useMemo(() => new window.google.maps.DirectionsRenderer({
    draggable: true,
    map
  }), [map]);

  useEffect(() => {
    // const geocoder = new window.google.maps.Geocoder();
    if (ref.current && !map) {
      const map = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        // disableDefaultUI: true
      });

      // geocoder.geocode({'address': "Skopje"}, function(results, status) {
      //   if (status === 'OK') {
      //     map.setCenter(results[0].geometry.location);

      //     originMarker = new window.google.maps.Marker({
      //       map: map,
      //       position: results[0].geometry.location,
      //       draggable: true,
      //       onDragEnd: (t, map, coord) => console.log(t, map, coord)
      //     });

      //     originMarker.addListener("dragend", (event) => {
      //       setOriginMarker(event.latLng)
      //       console.log(event)
      //     });
      //   } else {
      //     console.log('Geocode was not successful for the following reason: ' + status);
      //   }
      // });

      setMap(map);
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

    const debouncedDisplayRoute = setTimeout(() => {
      displayRoute(
        origin,
        destination,
        directionsService,
        directionsRenderer
      );
    }, 400)

    const directionsListener = directionsRenderer.addListener("directions_changed", () => {
      const directions = directionsRenderer.getDirections();
      
      if (directions) {
        // there should be only one leg, no need to iterate
        const routeDetails = {
          startLoc: {
            lat: directions.routes[0].legs[0].start_location.lat(),
            lng: directions.routes[0].legs[0].start_location.lng(), 
            address: directions.routes[0].legs[0].start_address
          },          
          endLoc: {
            lat: directions.routes[0].legs[0].end_location.lat(),
            lng: directions.routes[0].legs[0].end_location.lng(),
            address: directions.routes[0].legs[0].end_address
          }
        }
        
        handleRouteMapDetails(routeDetails)
        setTotalDistanceAndDuration(computeTotalDistanceAndDuration(directions));
      }
    });

    return () => {
      window.google.maps.event.removeListener(directionsListener);
      clearTimeout(debouncedDisplayRoute);
    }
  }, [ref, map, center, zoom, origin, destination, directionsService, directionsRenderer, handleRouteMapDetails]);
  
  return (
    <>
      <div className="form-field">
        <label htmlFor="origin">Origin</label>
        <input type='text' id="origin" value={origin} onChange={e => setOrigin(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="destination">Destination</label>
        <input type='text' id="destination" value={destination} onChange={e => setDestination(e.target.value)} />
      </div>
      
      <div className="map__wrapper">
        <div className="map__distance">{totalDistanceAndDuration.distance} km / {totalDistanceAndDuration.duration}h</div>
        <div ref={ref} id='map' className="map__route" style={{height: '500px'}} />
      </div>
    </>
  );
}

export default Map;