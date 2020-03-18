import { Collection, FilterQuery, FindOneOptions } from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    query: FilterQuery<any>;
    options?: FindOneOptions;
}

export const findOneAndDeleteSignature = Object.freeze({
    input: ['query', 'options?'],
});

export async function findOneAndDelete(
    collection: Collection,
    args: Arguments,
): Promise<any | null> {
    const op = await collection.findOneAndDelete(args.query, args.options);

    return normalizeDocument(op.value);
}
