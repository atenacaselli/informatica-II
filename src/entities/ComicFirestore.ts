export default class ComicFirestore {
    public readonly comments: Array<string>;
    public rating: number;

    public constructor(comments: Array<string>, rating: number) {
        this.comments = comments;
        this.rating = rating;
    }
}