import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from 'utilities/constants/firebaseConfig';

class FirebaseDatabase {
  constructor() {
    if (!this._instance) {
      this.init();
      this._instance = this;
    }

    return this._instance;
  }

  init() {
    try {
      this.app = initializeApp(FIREBASE_CONFIG);
      this.firestore = getFirestore(this.app);
    } catch (error) {
      console.error(`Firebase initialization error: ${error}`);
    }
  }
}

const FirebaseDbInstance = new FirebaseDatabase();

export default FirebaseDbInstance; 