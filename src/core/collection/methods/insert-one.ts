import { Collection, CollectionInsertOneOptions } from 'mongodb';

export interface Arguments {
    doc: any;
    options?: CollectionInsertOneOptions;
}

export async function insertOne(
    collection: Collection,
    args: Arguments,
): Promise<string> {
    const out = await collection.insertOne(args.doc, args.options);

    return out.insertedId.toString();
}
