import { Collection, FilterQuery, ReadPreferenceOrMode } from 'mongodb';

export interface Arguments {
    key: string;
    query?: FilterQuery<any>;
    options?: { readPreference?: ReadPreferenceOrMode; maxTimeMS?: number };
}

export const distinctSignature = Object.freeze({
    input: ['key', 'query?', 'options?'],
});

export async function distinct(
    collection: Collection,
    args: Arguments,
): Promise<number> {
    return collection.distinct(args.key, args.query, args.options);
}
