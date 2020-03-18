import {
    Collection,
    CollectionMapFunction,
    CollectionReduceFunction,
    MapReduceOptions,
} from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    map: CollectionMapFunction<any> | string;
    reduce: CollectionReduceFunction<any, any> | string;
    options?: MapReduceOptions;
}

export async function mapReduce(
    collection: Collection,
    args: Arguments,
): Promise<any[]> {
    const cursor = await collection.mapReduce(
        args.map,
        args.reduce,
        args.options,
    );

    const result: any[] = [];

    try {
        await cursor.forEach((doc: any) => {
            result.push(normalizeDocument(doc));
        });
    } catch (e) {
        await cursor.close();

        throw e;
    }

    await cursor.close();

    return result;
}
