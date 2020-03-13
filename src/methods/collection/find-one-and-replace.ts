import { Collection, FilterQuery, FindOneOptions } from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    query: FilterQuery<any>;
    replacement: any;
    options?: FindOneOptions;
}

export async function findOneAndReplace(
    collection: Collection,
    args: Arguments,
): Promise<any | null> {
    const op = await collection.findOneAndReplace(
        args.query,
        args.replacement,
        args.options,
    );

    return normalizeDocument(op.value);
}
