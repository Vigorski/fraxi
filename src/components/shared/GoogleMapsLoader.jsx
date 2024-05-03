import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Spinner from './Spinner';

const libraries = ['places'];

const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <Spinner message={'Loading maps...'} />;
  }

  return <>{children}</>;
};

export default GoogleMapsLoader;
