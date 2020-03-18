import { Collection, CommonOptions } from 'mongodb';

export interface Arguments {
    name: string;
    options?: CommonOptions & { maxTimeMS?: number };
}

export const dropIndexSignature = Object.freeze({
    input: ['name', 'options?'],
});

export async function dropIndex(
    collection: Collection,
    args: Arguments,
): Promise<void> {
    await collection.dropIndex(args.name, args.options);
}
