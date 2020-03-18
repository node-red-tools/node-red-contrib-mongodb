import {
    Collection,
    FilterQuery,
    UpdateManyOptions,
    UpdateQuery,
} from 'mongodb';

export interface Arguments {
    query: FilterQuery<any>;
    update: UpdateQuery<any>;
    options?: UpdateManyOptions;
}

export const updateManySignature = Object.freeze({
    input: ['query', 'update', 'options?'],
});

export async function updateMany(
    collection: Collection,
    args: Arguments,
): Promise<number> {
    const out = await collection.updateMany(
        args.query,
        args.update,
        args.options,
    );

    return out.result.n;
}
