import { Collection } from 'mongodb';

export interface Arguments {
    options?: { maxTimeMS?: number };
}

export const dropIndexesSignature = Object.freeze({
    input: ['options?'],
});

export async function dropIndexes(
    collection: Collection,
    args: Arguments,
): Promise<void> {
    await collection.dropIndexes(args.options);
}
