export type AddressComponentsRefined = {
  street?: string;
  city?: string;
  postalCode?: string;
};

export type WaypointRefined = {
  location: google.maps.LatLng;
  stopover: boolean;
  userId?: string;
  formatted_address?: string;
};
