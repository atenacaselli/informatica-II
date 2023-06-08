import md5 from 'crypto-js/md5';
import { MarvelData } from '../entities/marvel-response';
import axios from 'axios';
import Comic from '../entities/comic';

export default class MarvelController {
    private static readonly privateKey = '1a1f51fc5204d9549f88e6ec2a6ce4f5143c6f88';
    private static readonly publicKey = '8d75b87834f54f8e17c8639cc3864f7f';

    private static authorComics = new Map<string, [Comic]>();
    private static idsComic = new Map<number, Comic>();
    private static authors = new Set<string>();

    public static initPromise: Promise<void>;

    public static async init(): Promise<void> {
        const data = await this.getAllComics();

        const promises = [];

        for (const result of data.results) {
            for (const author of result.creators.items) {
                // this.authors.add(author.name);

                const newComic = new Comic(
                    result.id,
                    result.title,
                    result.series.name,
                    result.prices?.[0].price,
                    `${result.thumbnail.path}.${result.thumbnail.extension}`,
                    result.creators.items.map(creator => creator.name).sort(),
                    // result.creators.items.sort((creatorA, creatorB) => creatorA.name.localeCompare(creatorB.name)).map(creator => creator.name),
                );

                promises.push(newComic.fetchComicsAdditionalData());
                promises.push(newComic.fetchComments());

                if (this.authorComics.has(author.name)) {
                    this.authorComics.get(author.name)?.push(newComic);
                } else {
                    this.authorComics.set(author.name, [newComic]);
                }

                this.idsComic.set(newComic.id, newComic);
            }
        }

        
        const authorComicsArray = Array.from(this.authorComics);
        authorComicsArray.sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
        
        this.authorComics.clear();
        
        for (const authorComic of authorComicsArray) {
            this.authors.add(authorComic[0]);
            this.authorComics.set(authorComic[0], authorComic[1]);
        }
        
        await Promise.allSettled(promises);
    }

    public static getAuthors(): Array<string> {
        return Array.from(this.authors.keys());
    }

    public static getComicsByAuthor(fullname: string): Array<Comic> {
        const res = this.authorComics.get(fullname) ?? []
        return Array.from(res);
    }

    public static getComicById(id: number): Comic | null {
        return this.idsComic.get(id) ?? null;
    }

    private static async getAllComics(): Promise<MarvelData> {
        const hash = this.computeHash();

        const request = await axios.get('http://gateway.marvel.com/v1/public/comics', {
            params: {
                ts: hash.timestamp,
                apikey: this.publicKey,
                hash: hash.hash,
            },
        });

        return request.data.data as MarvelData;
    }

    private static computeHash(): { timestamp: number, hash: string } {
        const timestamp = new Date().getTime();
        return {
            timestamp: timestamp, hash: md5(`${timestamp}${this.privateKey}${this.publicKey}`).toString()
        };
    }
}
