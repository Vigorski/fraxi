import { initializeApp, FirebaseApp as FirebaseAppType } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { FIREBASE_CONFIG } from 'utilities/constants/firebaseConfig';

class FirebaseApp {
  private static _instance: FirebaseApp;
	private _app?: FirebaseAppType;
	private _firestore?: Firestore;
	private _auth?: Auth;
	private _googleAuthProvider?: GoogleAuthProvider;

  constructor() {
    if (!FirebaseApp._instance) {
      this.init();
      FirebaseApp._instance = this;
    }

    return FirebaseApp._instance;
  }

  static getInstance() {
    if (!FirebaseApp._instance) {
      FirebaseApp._instance = new FirebaseApp();
    }

    return FirebaseApp._instance;
  }

  private init() {
    try {
      this._app = initializeApp(FIREBASE_CONFIG);
      this._firestore = getFirestore(this._app);
      this._auth = getAuth(this._app)
      this._googleAuthProvider = new GoogleAuthProvider();
      this._googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
      this._googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    } catch (error: any) {
      console.error(`Firebase initialization error: ${error}`);
    }
  }

	get app() {
    if (!this._app) {
      throw new Error("Firebase app is not initialized");
    }

    return this._app;
  }

  get firestore() {
    if (!this._firestore) {
      throw new Error("Firestore is not initialized");
    }

    return this._firestore;
  }

  get auth() {
    if (!this._auth) {
      throw new Error("Auth is not initialized");
    }

    return this._auth;
  }

  get googleAuthProvider() {
    if (!this._googleAuthProvider) {
      throw new Error("Google Auth Provider is not initialized");
    }
		
    return this._googleAuthProvider;
  }
}

export default FirebaseApp;