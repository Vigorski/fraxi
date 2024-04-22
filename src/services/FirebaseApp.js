import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { FIREBASE_CONFIG } from 'utilities/constants/firebaseConfig';

class FirebaseApp {
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
      this.auth = getAuth(this.app)
      this.googleAuthProvider = new GoogleAuthProvider();
      this.googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
      this.googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    } catch (error) {
      console.error(`Firebase initialization error: ${error}`);
    }
  }
}

const FirebaseAppInstance = new FirebaseApp();

export default FirebaseAppInstance; 