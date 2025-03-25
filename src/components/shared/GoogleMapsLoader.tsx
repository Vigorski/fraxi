import React, { FC, ReactElement } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Spinner from './Spinner';
import { Library } from 'types/map';

const libraries: Library[] = ['places'];

type GoogleMapsOwnProps = {
	children: ReactElement
}

const GoogleMapsLoader: FC<GoogleMapsOwnProps> = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
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
