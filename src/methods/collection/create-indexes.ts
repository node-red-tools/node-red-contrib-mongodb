import { Collection, IndexSpecification } from 'mongodb';

export interface Arguments {
    spec: IndexSpecification[];
}

export async function createIndexes(
    collection: Collection,
    args: Arguments,
): Promise<void> {
    await collection.createIndexes(args.spec);
}
