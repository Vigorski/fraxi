import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updatePassword,
  signInWithRedirect,
  // getRedirectResult,
  // connectAuthEmulator,
  deleteUser,
  signInWithPopup,
} from 'firebase/auth';
import FirebaseAppInstance from './FirebaseApp';

// connectAuthEmulator(FirebaseAppInstance.auth, 'http://localhost:3000')

export default class FirebaseAuthService {
  static async registerWithEmail(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FirebaseAppInstance.auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FirebaseAppInstance.auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async signOut() {
    await signOut(FirebaseAppInstance.auth);
  }

  static getCurrentUser() {
    return FirebaseAppInstance.auth.currentUser;
  }

  static async deleteUser() {
    const currentUser = this.getCurrentUser();
    await deleteUser(currentUser);
  }

  static async updatePassword(newPassword) {
    const user = this.getCurrentUser();
    
    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static authObserver(callback) {
    return onAuthStateChanged(FirebaseAppInstance.auth, callback);
  }

  static async loginWithGoogle() {
    try {
      // FirebaseAppInstance.auth.signInSuccessUrl = window.location.href;
      await signInWithRedirect(FirebaseAppInstance.auth, FirebaseAppInstance.googleAuthProvider);
      // Popup
      // const result = await signInWithPopup(FirebaseAppInstance.auth, FirebaseAppInstance.googleAuthProvider);
      // return result.user;

      // Redirect
    } catch (error) {
      const credential = FirebaseAppInstance.googleAuthProvider.credentialFromError(error);
      console.log(credential)
      throw new Error(error.message);
    }
  }
}
