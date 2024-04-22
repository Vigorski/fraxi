import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updatePassword,
  // signInWithPopup,
  // signInWithRedirect,
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
      // Popup
      const result = await signInWithPopup(FirebaseAppInstance.auth, FirebaseAppInstance.googleAuthProvider);
      return result.user;

      // Redirect
      // await signInWithRedirect(FirebaseAppInstance.auth, FirebaseAppInstance.googleAuthProvider);
      // const userCredential = await getRedirectResult(FirebaseAppInstance.auth);
      // const token = userCredential.accessToken;
      // console.log(token);
      // console.log(userCredential)
      // return { user: userCredential.user, method: 'google' };
    } catch (error) {
      const credential = FirebaseAppInstance.googleAuthProvider.credentialFromError(error);
      console.log(credential)
      throw new Error(error.message);
    }
  }
}
