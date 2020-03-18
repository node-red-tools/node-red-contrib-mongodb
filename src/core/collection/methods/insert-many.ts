import { Collection, CollectionInsertManyOptions } from 'mongodb';

export interface Arguments {
    docs: any[];
    options?: CollectionInsertManyOptions;
}

export const insertManySignature = Object.freeze({
    input: ['docs', 'options?'],
});

export async function insertMany(
    collection: Collection,
    args: Arguments,
): Promise<string[]> {
    const res = await collection.insertMany(args.docs, args.options);

    return Object.keys(res.insertedIds).map((key: any) => {
        return res.insertedIds[key].toString();
    });
}
