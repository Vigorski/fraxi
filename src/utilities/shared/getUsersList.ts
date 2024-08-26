import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { where } from 'firebase/firestore';
import { User } from 'types/user';

export const getUsersList = async (users: string[]) => {
  try {
    const comboUsersCall = users.map(userId =>
      FirebaseFirestoreService.get('/users', [where('userId', '==', userId)]),
    );

    const usersFull = await Promise.all(comboUsersCall);
    const usersSpread = usersFull.map(user => user[0]) as User[];

    return usersSpread;
  } catch (err: any) {
    throw new Error(err);
  }
};
