export type AddressComponents = {
  street?: string;
  city?: string;
  postalCode?: string;
};

type Location = {
  lat: number;
  lng: number;
};

export type Waypoint = {
  location: Location;
  stopover: boolean;
  userId: string;
  formatted_address?: string;
};

export type Place = {
  address_components: AddressComponents;
  location: Location;
  formatted_address?: string;
  place_id?: string;
};

export type Route = {
  origin?: Place;
  destination?: Place;
  waypoints?: Waypoint[];
  travelMode?: google.maps.TravelMode;
};

export interface CachedWaypointInfo extends Waypoint {
  totalDistanceInKm: string;
  totalFormattedDuration: string;
  fullname: string;
}

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

export type DirectionsWaypoint = google.maps.DirectionsWaypoint;
export type DirectionsResult = google.maps.DirectionsResult;
export type DirectionsStatus = google.maps.DirectionsStatus;
export type PlaceResult = google.maps.places.PlaceResult;
export type AutocompleteType = InstanceType<
  typeof google.maps.places.Autocomplete
>;
export interface ExtendedAutocompleteType extends AutocompleteType {
  componentRestrictions: {
    country: string;
  };
  gm_accessors_: {
    [key: string]: any;
  };
  gm_bindings_: {
    [key: string]: any;
  };
  types: string[];
  __e3_: {
    [key: string]: any;
  };
}
