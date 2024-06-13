import {
  collection,
  getDocs,
  // addDoc,
  setDoc,
  // onSnapshot,
  // deleteDoc,
  doc,
  updateDoc,
  query,
	DocumentData,
	QueryConstraint,
	Firestore,
  // orderBy,
  // serverTimestamp, //simply invoke this fn and will return a timestamp
} from 'firebase/firestore';
import FirebaseApp from './FirebaseApp';

const FirebaseAppInstance = FirebaseApp.getInstance();

export default class FirebaseFirestoreService {
  static async get(path: string, queryParams: QueryConstraint[]): Promise<DocumentData[]> {
    const data: DocumentData[] = [];
    const colRef = collection(FirebaseAppInstance.firestore as Firestore, path);
    const complexQuery = query(colRef, ...queryParams);
    const snapshot = await getDocs(complexQuery);

    snapshot.docs.forEach(doc => {
      data.push({ ...doc.data(), id: doc.id });
    });

    return data;
  }

  static async add(path: string, id: string, values: DocumentData) {
    const docRef = doc(FirebaseAppInstance.firestore, path, id);
    const docResponse = await setDoc(docRef, values, { merge: true });
    return docResponse;
  }

  static async update(path: string, id: string, values: Partial<DocumentData>) {
    const docRef = doc(FirebaseAppInstance.firestore, path, id);
    const docResponse = await updateDoc(docRef, values);
    return docResponse;
  }
}

///////////////////////////////////////////////////////////////

// await onValue(ref(db, url), (snapshot) => {
//   const data = snapshot.val();
//   return data;
// });

///////////////////////////////////////////////////////////////

// //complex query
// // const complexQuery = query(colRef, where('email', '==', 'vigorski@mail.com'), orderBy('email', 'desc'))

// // listening to db changes
// // onSnapshot(complexQuery, snapshot => {
// // 	const users = [];
// // 	snapshot.docs.forEach(doc => {
// // 		users.push({ ...doc.data(), id: doc.id });
// // 	});
// // 	console.log(users);
// // });

// // delete
// export const deleteUser = async () => {
//   const docRef = doc(dbFB, 'users', 'Z0zelEXQ0bVfVEhDGFHX');
//   await deleteDoc(docRef).then(() => {});
// }

////////////////////////////////////////////////////////////////
