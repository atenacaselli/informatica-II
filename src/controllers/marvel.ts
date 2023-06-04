import md5 from 'crypto-js/md5';
import { MarvelData } from '../entities/marvel-response';
import axios from 'axios';
import Comic from '../entities/comic';

export default class MarvelController {
    private static readonly privateKey = '1a1f51fc5204d9549f88e6ec2a6ce4f5143c6f88';
    private static readonly publicKey = '8d75b87834f54f8e17c8639cc3864f7f';

    private static authorComics = new Map<string, [Comic]>();

    public static async init(): Promise<void> {
        const data = await this.getAllComics();

        for (const result of data.results) {
            for (const author of result.creators.items) {
                const newThing = new Comic(
                    result.id,
                    result.title,
                    result.series.name,
                    result.prices?.[0].price,
                    `${result.thumbnail.path}.${result.thumbnail.extension}`,
                    result.creators.items.map(creator => creator.name),
                );

                if (this.authorComics.has(author.name)) {
                    this.authorComics.get(author.name)?.push(newThing);
                } else {
                    this.authorComics.set(author.name, [newThing]);
                }
            }
        }
    }

    public static async getComicsByAuthor(fullname: string): Promise<Array<Comic>> {
        if (this.authorComics.size === 0) {
            await this.init();
        }

        return this.authorComics.get(fullname) ?? [];
    }

    private static async getAllComics(): Promise<MarvelData> {
        const hash = this.getHash();

        const request = await axios.get('http://gateway.marvel.com/v1/public/comics', {
            params: {
                ts: hash.timestamp,
                apikey: this.publicKey,
                hash: hash.hash,
            },
        });

        return request.data.data as MarvelData;
    }

    private static getHash(): { timestamp: number, hash: string } {
        const timestamp = new Date().getTime();
        return {
            timestamp: timestamp, hash: md5(`${timestamp}${this.privateKey}${this.publicKey}`).toString()
        };
    }
}