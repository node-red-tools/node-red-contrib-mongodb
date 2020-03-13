import { Collection, FilterQuery, FindOneOptions } from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    query: FilterQuery<any>;
    options?: FindOneOptions;
}

export async function findOneAndDelete(
    collection: Collection,
    args: Arguments,
): Promise<any | null> {
    const op = await collection.findOneAndDelete(args.query, args.options);

    return normalizeDocument(op.value);
}
