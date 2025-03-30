export const mapDarkTheme = [
  { elementType: 'geometry', stylers: [{ color: '#2D303D' }] }, // Background color
  { elementType: 'labels.text.stroke', stylers: [{ color: '#2D303D' }] }, // Text stroke color
  { elementType: 'labels.text.fill', stylers: [{ color: '#73e5aa' }] },	// Text fill color

  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // City name labels
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // POI labels
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#016a70' }],  // Parks
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // Park labels
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#4c505b' }],  // Muted road
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],  // Road stroke
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // Road labels
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#4c505b' }],  // Highways with
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],  // Highway stroke
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // Highway labels
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],  // Transit routes
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // Transit station labels
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#69ABDC' }],  // Water
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#73e5aa' }],  // Water labels
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#2D303D' }],  // Water label stroke
  },
];