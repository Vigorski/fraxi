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

export type AutocompleteType = InstanceType<typeof google.maps.places.Autocomplete>;

export interface ExtendedAutocompleteType extends AutocompleteType {
  componentRestrictions: {
    country: string
  }
  gm_accessors_: {
    [key: string]: any
  };
  gm_bindings_: {
    [key: string]: any,
  }
  types: string[];
  __e3_: {
    [key: string]: any
  }
}