import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocsFromServer, getDocFromServer, doc, query, orderBy } from 'firebase/firestore';

export type ComicComment = { id: number, createdAt: Date, comment: string, isLiked: boolean, isDisliked: boolean };
export type ComicAdditionalData = { isLiked: boolean, isDisliked: boolean, rating: number };

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

    public static async getComicsAdditionalDataById(comicId: number): Promise<ComicAdditionalData | null> {
        const commentsDocRef = doc(this.firestoreDb, 'comics', comicId.toString(),);
        const docSnap = await getDocFromServer(commentsDocRef);
        const docData = docSnap.data();
        if (docData == null) {
            return null;
        }

        return { isLiked: docData.isLiked, isDisliked: docData.isDisliked, rating: docData.rating };
    }

    public static async getCommentsFor(comicId: number): Promise<Array<ComicComment>> {
        const commentsRef = collection(this.firestoreDb, 'comics', comicId.toString(), 'comments');
        const commentsQuery = query(commentsRef, orderBy('createdAt', 'desc'));
        const commentsDoc = await getDocsFromServer(commentsQuery);

        const result = new Array<ComicComment>();

        for (const doc of commentsDoc.docs) {
            const docData = doc.data();
            result.push({
                id: +doc.id,
                createdAt: new Date(docData.createdAt.seconds * 1000),
                comment: docData.comment,
                isLiked: docData.isLiked,
                isDisliked: docData.isDisliked,
            });
        }

        return result;
    }
}
