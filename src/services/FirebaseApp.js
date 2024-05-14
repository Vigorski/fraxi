import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { FIREBASE_CONFIG } from 'utilities/constants/firebaseConfig';

class FirebaseApp {
  static _instance = null;

  constructor() {
    if (!FirebaseApp._instance) {
      this.init();
      FirebaseApp._instance = FirebaseApp;
    }

    return FirebaseApp._instance;
  }

  static getInstance() {
    if (!FirebaseApp._instance) {
      FirebaseApp._instance = new FirebaseApp();
    }

    return FirebaseApp._instance;
  }

  init() {
    try {
      FirebaseApp.app = initializeApp(FIREBASE_CONFIG);
      FirebaseApp.firestore = getFirestore(FirebaseApp.app);
      FirebaseApp.auth = getAuth(FirebaseApp.app)
      FirebaseApp.googleAuthProvider = new GoogleAuthProvider();
      FirebaseApp.googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
      FirebaseApp.googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    } catch (error) {
      console.error(`Firebase initialization error: ${error}`);
    }
  }
}

export default FirebaseApp; 