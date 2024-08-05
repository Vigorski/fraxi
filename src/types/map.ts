export type AddressComponentsRefined = {
  street?: string;
  city?: string;
  postalCode?: string;
};

export type Waypoint = {
  location: google.maps.LatLng;
  stopover: boolean;
  userId?: string;
  formatted_address?: string;
};

export type Place = {
  address_components: AddressComponentsRefined;
  formatted_address: string;
  location: google.maps.LatLng;
  placeId: string;
};

export type Route = {
  origin: Place;
  destination: Place;
  waypoints: Waypoint[];
  travelMode: google.maps.TravelMode;
};

export type Library =
  | 'core'
  | 'maps'
  | 'places'
  | 'geocoding'
  | 'routes'
  | 'marker'
  | 'geometry'
  | 'elevation'
  | 'streetView'
  | 'journeySharing'
  | 'drawing'
  | 'visualization';
