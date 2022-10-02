import { initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '../../utilities/constants/db';
import {
	collection,
	getFirestore,
	getDocs,
	addDoc,
  setDoc,
	// onSnapshot,
	// deleteDoc,
	doc,
	updateDoc,
	query,
	where,
	// orderBy,
	// serverTimestamp, //simply invoke this fn and will return a timestamp
} from 'firebase/firestore';

const app = initializeApp(FIREBASE_CONFIG);
const dbFB = getFirestore(app);

//get once
export const getFB = async (url, val, queryParamValues) => {
	// this is probably not a good way to make complex queries
	const queryParams = queryParamValues.map((param) => {
		return where(param, '==', val[param]);
	});
	const data = [];
	const colRef = collection(dbFB, url);
	const complexQuery = query(colRef, ...queryParams);

	const snapshot = await getDocs(complexQuery);

	snapshot.docs.forEach((doc) => {
		data.push({ ...doc.data(), id: doc.id });
	});

	return data;
};

// push
export const addFB = async (url, values) => {
	const colRef = collection(dbFB, url);
	const docResponse = await addDoc(colRef, values);
	return docResponse;
};

export const addFBWithId = async (url, values, id) => {
	const docRef = doc(dbFB, url, id);
	const docResponse = await setDoc(docRef, values, { merge: true });
	return docResponse;
};

// update
export const updateFB = async (url, id, values) => {
	const docRef = doc(dbFB, url, id);
	const docResponse = await updateDoc(docRef, values);
	return docResponse;
};

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
