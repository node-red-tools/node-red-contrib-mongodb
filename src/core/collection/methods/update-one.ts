import {
    Collection,
    FilterQuery,
    UpdateOneOptions,
    UpdateQuery,
} from 'mongodb';

export interface Arguments {
    query: FilterQuery<any>;
    update: UpdateQuery<any>;
    options?: UpdateOneOptions;
}

export const updateOneSignature = Object.freeze({
    input: ['query', 'update', 'options?'],
});

export async function updateOne(
    collection: Collection,
    args: Arguments,
): Promise<number> {
    const out = await collection.updateOne(
        args.query,
        args.update,
        args.options,
    );

    return out.result.n;
}
