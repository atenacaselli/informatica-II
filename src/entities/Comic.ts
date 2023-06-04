import ComicFirestore from './comic-firestore';

export default class Comic {
    public readonly id: number;
    public readonly title: string;
    public readonly seriesName: string;
    public readonly price: number | null;
    public readonly thumbnail: string;
    public readonly creatorNames: Array<string>;
    public readonly comments: Array<string>;
    public get rating(): number {
        return this.comicFirestore?.rating ?? 0;
    }
    public set rating(val: number) {
        this.comicFirestore!.rating = val;
    }

    private comicFirestore?: ComicFirestore;

    public constructor(id: number, title: string, seriesName: string, price: number | undefined, thumbnail: string, creatorNames: Array<string>) {
        this.id = id;
        this.title = title;
        this.seriesName = seriesName;
        this.price = price ?? null;
        this.thumbnail = thumbnail;
        this.creatorNames = creatorNames;
        this.comments = ['ciao', 'come', 'stai', '?'];
    }

    public async getFirestoreData(): Promise<ComicFirestore> {
        if (this.comicFirestore != null) {
            return this.comicFirestore;
        }

        this.comicFirestore = await new Promise<ComicFirestore>((res) => {
            res(new ComicFirestore(['first comment'], 3));
        });

        return this.comicFirestore;
    }

    public getRandomComment(): string {
        if (this.comments.length === 0) {
            return '';
        }

        const randomIdx = Math.floor(Math.random() * this.comments.length);
        return this.comments[randomIdx];
    }
}