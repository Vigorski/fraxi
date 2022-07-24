import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, set, update } from 'firebase/database';
import { FIREBASE_CONFIG } from '../../utilities/constants/db';

import { 
  collection, 
  getFirestore, 
  getDocs, 
  addDoc, 
  // onSnapshot, 
  deleteDoc, 
  doc,
  updateDoc,
  query, where,
  orderBy,
  // serverTimestamp, //simply invoke this fn and will return a timestamp
} from 'firebase/firestore';

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);
const dbRef = ref(getDatabase(app));

export const getRequest = async (url) => {
  const snapshot = await get(child(dbRef, url));

  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error('No data available')
  }
};

export const postRequest = async (url, values) => {
	await set(ref(db, url), values);
};

export const patchRequest = async (url, key, values) => {
	const updates = {};
	updates[`${url}/${key}`] = values;
	const patchData = await update(ref(db), updates);
	return patchData;
};

///////////////////////////////////////////////////////////////

// await onValue(ref(db, url), (snapshot) => {
//   const data = snapshot.val();
//   return data;
// });

///////////////////////////////////////////////////////////////

const dbFB = getFirestore(app);

//get once
export const getFB = async (url, val, queryParams) => {
  const data = [];
  const colRef = collection(dbFB, url);
  const complexQuery = query(
    colRef, 
    where('email', '==', val.email),
    // where(queryParams[0], '==', val[queryParams[0]]),
    where('password', '==', val.password),
  );

	const snapshot = await getDocs(complexQuery);

  snapshot.docs.forEach(doc => {
    data.push({ ...doc.data(), id: doc.id });
  });
  
  return data;
};

// push
export const addFB = async (url, values) => {
  const colRef = collection(dbFB, url);
	await addDoc(colRef, values);
};

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

// // update individual document
// export const updateUser = async () => {
//   const docRef = doc(dbFB, 'users', 'Z0zelEXQ0bVfVEhDGFHX');
//   await updateDoc(docRef, {
//     email: 'updated@mail.com'
//     // will only update entered properties
//   }).then(() => {});
// }
////////////////////////////////////////////////////////////////
