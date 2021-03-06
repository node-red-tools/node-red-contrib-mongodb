import { Collection, FilterQuery, ReplaceOneOptions } from 'mongodb';

export interface Arguments {
    query: FilterQuery<any>;
    replacement: any;
    options?: ReplaceOneOptions;
}

export const replaceOneSignature = Object.freeze({
    input: ['query', 'replacement', 'options?'],
});

export async function replaceOne(
    collection: Collection,
    args: Arguments,
): Promise<string> {
    const out = await collection.replaceOne(
        args.query,
        args.replacement,
        args.options,
    );

    return out.upsertedId.toString();
}
