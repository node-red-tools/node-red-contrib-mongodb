import {
    Collection as DbCollection,
    CollectionCreateOptions,
    Db,
    DbCollectionOptions,
    IndexSpecification,
} from 'mongodb';
import { MethodDescription, list, resolve } from './method';

export interface CollectionSettings {
    name: string;
    options?: DbCollectionOptions;
    autoCreate?: boolean;
    autoCreateOptions?: CollectionCreateOptions;
    autoCreateIndexes?: IndexSpecification[];
}

export class Collection {
    private __instance: DbCollection;

    public static async create(
        db: Db,
        collection: CollectionSettings,
    ): Promise<Collection> {
        const instance = await db.createCollection(
            collection.name,
            collection.autoCreateOptions,
        );

        try {
            if (
                Array.isArray(collection.autoCreateIndexes) &&
                collection.autoCreateIndexes.length > 0
            ) {
                await instance.createIndexes(collection.autoCreateIndexes);
            }

            return new Collection(instance);
        } catch (e) {
            await db.dropCollection(instance.collectionName);

            throw e;
        }
    }

    public static methods(): MethodDescription[] {
        return list();
    }

    constructor(instance: DbCollection) {
        this.__instance = instance;
    }

    public get name(): string {
        return this.__instance.collectionName;
    }

    public async execute<TIn = any, TOut = any>(
        methodName: string,
        args: TIn,
    ): Promise<TOut> {
        const method = resolve(methodName);

        if (!method) {
            return Promise.reject(
                new Error(
                    `Invalid method name of "${this.name}" collection: ${methodName}`,
                ),
            );
        }

        return method(this.__instance, args);
    }
}
