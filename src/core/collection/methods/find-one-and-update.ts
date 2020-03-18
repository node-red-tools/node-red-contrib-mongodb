import { Collection, FilterQuery, FindOneOptions, UpdateQuery } from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    query: FilterQuery<any>;
    update: UpdateQuery<any>;
    options?: FindOneOptions;
}

export async function findOneAndUpdate(
    collection: Collection,
    args: Arguments,
): Promise<any | null> {
    const op = await collection.findOneAndUpdate(
        args.query,
        args.update,
        args.options,
    );

    return normalizeDocument(op.value);
}
