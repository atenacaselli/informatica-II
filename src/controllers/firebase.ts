import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, query, where } from 'firebase/firestore';

export default class FirebaseController {
    private static readonly config = {
        apiKey: 'AIzaSyBJ6MKYdOb-BXxbDTZ22jPmjNzlrx-9m5c',
        authDomain: 'books-ii.firebaseapp.com',
        projectId: 'books-ii',
        storageBucket: 'books-ii.appspot.com',
        messagingSenderId: '141100881096',
        appId: '1:141100881096:web:0c72666a687c656dcd81fd',
        measurementId: 'G-ZBCBYFZFLE'
    };
    private static readonly app = initializeApp(this.config);
    private static firestoreDb = getFirestore(this.app);

    public static async getComments(): Promise<[string]> {

        // const comic = doc(this.firestoreDb, 'comics', '82967');
        // const commentsQuery = query(
        //     collection(this.firestoreDb, 'comments'),
        //     where('comments'),
        // );

        const querySnapshot = await getDocs(collection(this.firestoreDb, 'comics', '82967'));
        for (const doc of querySnapshot.docs) {
            let subcollection = await getDocs(collection(this.firestoreDb, 'comments'))
        }

        // querySnapshot.forEach((doc) => {
        //     console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        // });
        return [''];
    }
}