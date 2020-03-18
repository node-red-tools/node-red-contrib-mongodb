import { Db, MongoClient } from 'mongodb';
import { Collection, CollectionSettings } from './collection';

export class Connection {
    private __client: MongoClient;
    private __db: Db;
    private __collections: { [name: string]: Collection };

    public static async open(
        uri: string,
        collections: CollectionSettings[],
    ): Promise<Connection> {
        const client = await MongoClient.connect(uri, {
            useUnifiedTopology: true,
        });
        const db = client.db();
        const c = await Promise.all(
            collections.map(i => Collection.open(db, i)),
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
