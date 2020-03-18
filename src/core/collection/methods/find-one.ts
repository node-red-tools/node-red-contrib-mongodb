import { Collection, FilterQuery, FindOneOptions } from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    query: FilterQuery<any>;
    options?: FindOneOptions;
}

export async function findOne(
    collection: Collection,
    args: Arguments,
): Promise<any | null> {
    const doc = await collection.findOne(args.query, args.options);

    return normalizeDocument(doc);
}
