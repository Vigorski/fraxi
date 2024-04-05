import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { where } from 'firebase/firestore';

export const getUsersList = async users => {
  try {
    const comboUsersCall = users.map(userId =>
      FirebaseFirestoreService.get('/users', [where('userId', '==', userId)])
    );

    const usersFull = await Promise.all(comboUsersCall);
    const usersSpread = usersFull.map(user => user[0]);

    return usersSpread;
  } catch (err) {
    console.log(err);
  }
};
