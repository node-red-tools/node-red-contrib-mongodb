import { Collection, FilterQuery, FindOneOptions } from 'mongodb';
import { normalizeDocument } from './helpers';

export interface Arguments {
    query: FilterQuery<any>;
    options?: FindOneOptions;
}

export const findSignature = Object.freeze({
    input: ['query', 'options?'],
});

export async function find(
    collection: Collection,
    args: Arguments,
): Promise<any[]> {
    const cursor = await collection.find(args.query, args.options);

    const result: any[] = [];

    try {
        await cursor.forEach(doc => {
            result.push(normalizeDocument(doc));
        });
    } catch (e) {
        await cursor.close();

        throw e;
    }

    await cursor.close();

    return result;
}
