import { Collection, IndexOptions } from 'mongodb';

export interface Arguments {
    fieldOrSpec: any;
    options?: IndexOptions;
}

export async function createIndex(
    collection: Collection,
    args: Arguments,
): Promise<void> {
    await collection.createIndex(args.fieldOrSpec, args.options);
}
