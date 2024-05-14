export default class GoogleMaps {
  static _instance = null;

  constructor() {
    if (!GoogleMaps._instance) {
      this.init();
      GoogleMaps._instance = this;
    }

    return GoogleMaps._instance;
  }

  static getInstance() {
    if (!GoogleMaps._instance) {
      GoogleMaps._instance = new GoogleMaps();
    }

    return GoogleMaps._instance;
  }

  init() {
    try {
      this.directionsService = new window.google.maps.DirectionsService();
    } catch (error) {
      console.error(`Google maps initialization error: ${error}`);
    }
  }
}