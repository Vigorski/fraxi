import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updatePassword
} from 'firebase/auth';
import FirebaseAppInstance from './FirebaseApp';

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
}
