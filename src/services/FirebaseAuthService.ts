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
	// Auth,
	User,
	NextOrObserver,
	GoogleAuthProvider,
} from 'firebase/auth';
import FirebaseApp from './FirebaseApp';

const FirebaseAppInstance = FirebaseApp.getInstance();

// connectAuthEmulator(FirebaseAppInstance.auth, 'http://localhost:3000')

export default class FirebaseAuthService {
  static async registerWithEmail(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FirebaseAppInstance.auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async loginWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        FirebaseAppInstance.auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async signOut() {
    await signOut(FirebaseAppInstance.auth);
  }

  static getCurrentUser(): User | null {
    return FirebaseAppInstance.auth.currentUser;
  }

  static async deleteUser() {
		try {
			const currentUser = this.getCurrentUser();

			if(currentUser) {
				await deleteUser(currentUser);
			}
    } catch {
      throw new Error('No current user to delete');
    }
  }

  static async updatePassword(newPassword: string) {
    const user = this.getCurrentUser();
    if(user) {
			try {
				await updatePassword(user, newPassword);
			} catch (error: any) {
				throw new Error(error.message);
			}
		} else {
			throw new Error("No current user to update password");
		}
  }

  static authObserver(callback: NextOrObserver<User>) {
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
    } catch (error: any) {
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(credential);
      throw new Error(error.message);
    }
  }
}
