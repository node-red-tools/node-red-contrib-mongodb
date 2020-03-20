import {
    Collection as DbCollection,
    Db,
    MongoClient,
    MongoClientOptions,
} from 'mongodb';
import { Collection, CollectionSettings } from './collection';

export class Connection {
    private __client: MongoClient;
    private __db: Db;
    private __collections: { [name: string]: Collection };

    public static async open(
        uri: string,
        collections: CollectionSettings[],
        options?: MongoClientOptions,
    ): Promise<Connection> {
        const client = await MongoClient.connect(
            uri,
            Object.assign(
                {
                    useUnifiedTopology: true,
                },
                options,
            ),
        );
        const db = client.db();
        const existingCollections = await db.collections();
        const hashMap = existingCollections.reduce(
            (res: any, c: DbCollection) => {
                const out = res;

                out[c.collectionName] = c;

                return res;
            },
            {},
        );

        const c = await Promise.all(
            collections.map(i => {
                const existing = hashMap[i.name];

                if (existing) {
                    return new Collection(existing);
                }

                if (!i.autoCreate) {
                    return Promise.reject(
                        new Error(
                            `Collection "${i.name}" does not exists in "${db.databaseName}" database`,
                        ),
                    );
                }

                return Collection.create(db, i);
            }),
        );

        return new Connection(client, db, c);
    }

    constructor(client: MongoClient, db: Db, collections: Collection[] = []) {
        this.__client = client;
        this.__db = db;
        this.__collections = collections.reduce((res: any, c: Collection) => {
            const out = res;

            out[c.name] = c;

            return out;
        }, {});
    }

    public isConnected(): boolean {
        this.__assertIsOpen();

        return this.__client.isConnected();
    }

    public db(): Db {
        this.__assertIsOpen();

        return this.__db;
    }

    public collection(name: string): Collection {
        this.__assertIsOpen();

        const collection = this.__collections[name];

        if (!collection) {
            throw new Error(
                `Collection "${name}" does not exist in "${this.__db.databaseName}" database.`,
            );
        }

        return collection;
    }

    public async close(): Promise<void> {
        this.__assertIsOpen();

        await this.__client.close();
        delete this.__client;
        delete this.__db;
        delete this.__collections;
    }

    private __assertIsOpen(): void {
        if (!this.__client) {
            throw new Error('Connection is closed');
        }
    }
}
