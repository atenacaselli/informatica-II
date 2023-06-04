import { Unsubscribe, uuidv4 } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocsFromServer, getDocFromServer, doc, query, orderBy, setDoc, updateDoc, onSnapshot, DocumentChangeType } from 'firebase/firestore';
import Comic from '../entities/comic';

export type ComicComment = { id: string, createdAt: Date, title: string, comment: string, isLiked: boolean, isDisliked: boolean };
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
        const commentsDocRef = doc(this.firestoreDb, 'comics', comicId.toString());
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
                id: doc.id,
                createdAt: new Date(docData.createdAt.seconds * 1000),
                title: docData.title,
                comment: docData.comment,
                isLiked: docData.isLiked,
                isDisliked: docData.isDisliked,
            });
        }

        return result;
    }

    public static async addCommentTo(comicId: number, title: string, comment: string): Promise<void> {
        const commentsRef = doc(this.firestoreDb, 'comics', comicId.toString(), 'comments', uuidv4());
        await setDoc(commentsRef, {
            title: title,
            comment: comment,
            createdAt: new Date(),
            isDisliked: false,
            isLiked: false,
        });
    }

    public static async updateComment(comicId: number, commentId: string, comment: Partial<ComicComment>): Promise<void> {
        const commentsRef = doc(this.firestoreDb, 'comics', comicId.toString(), 'comments', commentId);
        await updateDoc(commentsRef, comment);
    }

    public static async updateComic(comicId: number, comic: Partial<Comic>): Promise<void> {
        const commentsRef = doc(this.firestoreDb, 'comics', comicId.toString());
        await setDoc(commentsRef, comic, { merge: true });
    }

    public static listenForCommentsChanges(comicId: number, callback: ((comment: ComicComment, changeType: DocumentChangeType) => void)): Unsubscribe {
        const commentsQuery = query(collection(this.firestoreDb, 'comics', comicId.toString(), 'comments'));
        return onSnapshot(commentsQuery, (querySnapshot) => {
            for (const docChange of querySnapshot.docChanges()) {
                const docData = docChange.doc.data();
                if (docData == null) {
                    return;
                }

                callback(
                    {
                        id: docChange.doc.id,
                        createdAt: new Date(docData.createdAt.seconds * 1000),
                        title: docData.title,
                        comment: docData.comment,
                        isLiked: docData.isLiked,
                        isDisliked: docData.isDisliked,
                    },
                    docChange.type,
                );
            }
        });
    }

    public static listenForRatingChanges(comicId: number, callback: ((comicId: number, rating: number) => void)): Unsubscribe {
        const commentsDocRef = doc(this.firestoreDb, 'comics', comicId.toString());
        return onSnapshot(commentsDocRef, (querySnapshot) => {
            const docData = querySnapshot.data();
            if (docData == null) {
                return;
            }

            callback(comicId, docData.rating);
        });
    }
}
