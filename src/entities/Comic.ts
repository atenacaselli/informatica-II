import FirebaseController, { ComicAdditionalData, ComicComment } from '../controllers/firebase';

export default class Comic {
    public readonly id: number;
    public readonly title: string;
    public readonly seriesName: string;
    public readonly price: number | null;
    public readonly thumbnail: string;
    public readonly creatorNames: Array<string>;

    public comments: Array<ComicComment>;
    public get rating(): number {
        return this.comicAdditionalData?.rating ?? 0;
    }
    public set rating(val: number) {
        this.comicAdditionalData!.rating = val;
    }

    private comicAdditionalData?: ComicAdditionalData;

    public constructor(id: number, title: string, seriesName: string, price: number | undefined, thumbnail: string, creatorNames: Array<string>) {
        this.id = id;
        this.title = title;
        this.seriesName = seriesName;
        this.price = price ?? null;
        this.thumbnail = thumbnail;
        this.creatorNames = creatorNames;
        this.comments = [];
    }

    public async getComments(): Promise<Array<ComicComment>> {
        if (this.comments.length > 0) {
            return this.comments;
        }

        this.comments = await FirebaseController.getCommentsFor(this.id);

        return this.comments;
    }

    public async getComicsAdditionalData(): Promise<ComicAdditionalData | null> {
        if (this.comicAdditionalData != null) {
            return this.comicAdditionalData;
        }

        this.comicAdditionalData = await FirebaseController.getComicsAdditionalDataById(this.id) ?? undefined;

        return this.comicAdditionalData ?? null;
    }

    public getRandomComment(): ComicComment | null {
        if (this.comments.length === 0) {
            return null;
        }

        const randomIdx = Math.floor(Math.random() * this.comments.length);
        return this.comments[randomIdx];
    }
}
