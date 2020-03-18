import {
    Collection as DbCollection,
    CollectionCreateOptions,
    Db,
    DbCollectionOptions,
} from 'mongodb';
import { MethodDescription, list, resolve } from './method';

export interface CollectionSettings {
    name: string;
    options?: DbCollectionOptions;
    autoCreate?: boolean;
    autoCreateOptions?: CollectionCreateOptions;
}

export class Collection {
    private __instance: DbCollection;

    public static async open(
        db: Db,
        collection: CollectionSettings,
    ): Promise<Collection> {
        let instance = db.collection(
            collection.name,
            collection.options as any,
        );

        if (instance) {
            return Promise.resolve(new Collection(instance));
        }

        if (!collection.autoCreate) {
            return Promise.reject(
                new Error(
                    `Collection "${collection.name}" does not exists in "${db.databaseName}" database`,
                ),
            );
        }

        instance = await db.createCollection(
            collection.name,
            collection.autoCreateOptions,
        );

        return new Collection(instance);
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
