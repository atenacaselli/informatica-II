import FirebaseController, { ComicAdditionalData, ComicComment } from '../controllers/firebase';

export default class Comic {
    public readonly id: number;
    public readonly title: string;
    public readonly seriesName: string;
    public readonly price: number | null;
    public readonly thumbnailUrl: string;
    public readonly creatorNames: Array<string>;

    public comments: Array<ComicComment>;
    public get rating(): number {
        return this.comicAdditionalData.rating;
    }
    public set rating(val: number) {
        if (this.comicAdditionalData == null) {
            return;
        }

        this.comicAdditionalData.rating = val;
    }

    private comicAdditionalData: ComicAdditionalData = { isLiked: false, isDisliked: false, rating: 0 };

    public constructor(id: number, title: string, seriesName: string, price: number | undefined, thumbnailUrl: string, creatorNames: Array<string>) {
        this.id = id;
        this.title = title;
        this.seriesName = seriesName;
        this.price = price ?? null;
        this.thumbnailUrl = thumbnailUrl;
        this.creatorNames = creatorNames;
        this.comments = [];
    }

    public async fetchComments(): Promise<void> {
        this.comments = await FirebaseController.getCommentsFor(this.id);
    }

    public async fetchComicsAdditionalData(): Promise<void> {
        const additionalData = await FirebaseController.getComicsAdditionalDataById(this.id);
        if (additionalData == null) {
            return;
        }

        this.comicAdditionalData = additionalData;
    }

    public getRandomComment(): ComicComment | null {
        if (this.comments.length === 0) {
            return null;
        }

        const randomIdx = Math.floor(Math.random() * this.comments.length);
        return this.comments[randomIdx];
    }
}
