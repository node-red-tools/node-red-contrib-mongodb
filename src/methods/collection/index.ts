import { Collection } from 'mongodb';
import { countDocuments } from './count-documents';
import { createIndex } from './create-index';
import { createIndexes } from './create-indexes';
import { deleteMany } from './delete-many';
import { deleteOne } from './delete-one';
import { distinct } from './distinct';
import { dropIndex } from './drop-index';
import { dropIndexes } from './drop-indexes';
import { find } from './find';
import { findOne } from './find-one';
import { findOneAndDelete } from './find-one-and-delete';
import { findOneAndReplace } from './find-one-and-replace';
import { findOneAndUpdate } from './find-one-and-update';
import { insertMany } from './insert-many';
import { insertOne } from './insert-one';
import { mapReduce } from './map-reduce';
import { replaceOne } from './replace-one';
import { updateMany } from './update-many';
import { updateOne } from './update-one';

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
