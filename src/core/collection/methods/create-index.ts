import { Collection, IndexOptions } from 'mongodb';

export interface Arguments {
    spec: any;
    options?: IndexOptions;
}

export const createIndexSignature = Object.freeze({
    input: ['spec', 'options?'],
});

export async function createIndex(
    collection: Collection,
    args: Arguments,
): Promise<void> {
    await collection.createIndex(args.spec, args.options);
}
