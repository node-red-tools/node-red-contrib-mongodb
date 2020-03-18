import { Collection, CommonOptions, FilterQuery } from 'mongodb';

export interface Arguments {
    query: FilterQuery<any>;
    options?: CommonOptions;
}

export const deleteManySignature = Object.freeze({
    input: ['query', 'options?'],
});

export async function deleteMany(
    collection: Collection,
    args: Arguments,
): Promise<number> {
    const out = await collection.deleteMany(args.query, args.options);

    return out.deletedCount || 0;
}
