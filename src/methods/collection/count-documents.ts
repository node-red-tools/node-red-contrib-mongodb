import { Collection, FilterQuery, MongoCountPreferences } from 'mongodb';

export interface Arguments {
    query?: FilterQuery<any>;
    options?: MongoCountPreferences;
}

export async function countDocuments(
    collection: Collection,
    args: Arguments,
): Promise<number> {
    return collection.countDocuments(args.query, args.options);
}
