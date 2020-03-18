import { Collection } from 'mongodb';
import { countDocuments } from './methods/count-documents';
import { createIndex } from './methods/create-index';
import { createIndexes } from './methods/create-indexes';
import { deleteMany } from './methods/delete-many';
import { deleteOne } from './methods/delete-one';
import { distinct } from './methods/distinct';
import { dropIndex } from './methods/drop-index';
import { dropIndexes } from './methods/drop-indexes';
import { find } from './methods/find';
import { findOne } from './methods/find-one';
import { findOneAndDelete } from './methods/find-one-and-delete';
import { findOneAndReplace } from './methods/find-one-and-replace';
import { findOneAndUpdate } from './methods/find-one-and-update';
import { insertMany } from './methods/insert-many';
import { insertOne } from './methods/insert-one';
import { mapReduce } from './methods/map-reduce';
import { replaceOne } from './methods/replace-one';
import { updateMany } from './methods/update-many';
import { updateOne } from './methods/update-one';

export type Method = (collection: Collection, args: any) => Promise<any>;

const METHODS: { [name: string]: Method } = {
    countDocuments,
    createIndex,
    createIndexes,
    deleteMany,
    deleteOne,
    distinct,
    dropIndex,
    dropIndexes,
    find,
    findOne,
    findOneAndDelete,
    findOneAndReplace,
    findOneAndUpdate,
    insertMany,
    insertOne,
    mapReduce,
    replaceOne,
    updateMany,
    updateOne,
};

export function list(): string[] {
    return Object.keys(METHODS);
}

export function resolve(name: string): Method {
    return METHODS[name];
}
