export default class GoogleMaps {
  private static _instance: GoogleMaps;
	directionsService?: google.maps.DirectionsService;

  private constructor() {
    if (!GoogleMaps._instance) {
      this.init();
      GoogleMaps._instance = this;
    }

    return GoogleMaps._instance;
  }

  static getInstance(): GoogleMaps {
    if (!GoogleMaps._instance) {
      GoogleMaps._instance = new GoogleMaps();
    }

    return GoogleMaps._instance;
  }

  private init(): void {
    try {
      this.directionsService = new google.maps.DirectionsService();
    } catch (error) {
      console.error(`Google maps initialization error: ${error}`);
    }
  }
}