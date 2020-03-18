import { Collection, CommonOptions, FilterQuery } from 'mongodb';

export interface Arguments {
    query: FilterQuery<any>;
    options?: CommonOptions & { bypassDocumentValidation?: boolean };
}

export async function deleteOne(
    collection: Collection,
    args: Arguments,
): Promise<number> {
    const out = await collection.deleteOne(args.query, args.options);

    return out.deletedCount || 0;
}
