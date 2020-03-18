import { Collection } from 'mongodb';
import {
    countDocuments,
    countDocumentsSignature,
} from './methods/count-documents';
import { createIndex, createIndexSignature } from './methods/create-index';
import {
    createIndexes,
    createIndexesSignature,
} from './methods/create-indexes';
import { deleteMany, deleteManySignature } from './methods/delete-many';
import { deleteOne, deleteOneSignature } from './methods/delete-one';
import { distinct, distinctSignature } from './methods/distinct';
import { dropIndex, dropIndexSignature } from './methods/drop-index';
import { dropIndexes, dropIndexesSignature } from './methods/drop-indexes';
import { find, findSignature } from './methods/find';
import { findOne, findOneSignature } from './methods/find-one';
import {
    findOneAndDelete,
    findOneAndDeleteSignature,
} from './methods/find-one-and-delete';
import {
    findOneAndReplace,
    findOneAndReplaceSignature,
} from './methods/find-one-and-replace';
import {
    findOneAndUpdate,
    findOneAndUpdateSignature,
} from './methods/find-one-and-update';
import { insertMany, insertManySignature } from './methods/insert-many';
import { insertOne, insertOneSignature } from './methods/insert-one';
import { mapReduce, mapReduceSignature } from './methods/map-reduce';
import { replaceOne, replaceOneSignature } from './methods/replace-one';
import { updateMany, updateManySignature } from './methods/update-many';
import { updateOne, updateOneSignature } from './methods/update-one';

export type Method = (collection: Collection, args: any) => Promise<any>;
export interface MethodSignature {
    input: string[];
}

export interface MethodDescription {
    name: string;
    signature: MethodSignature;
}

interface MethodDefinition {
    fn: Method;
    signature: MethodSignature;
}

const METHODS: { [name: string]: MethodDefinition } = {
    countDocuments: {
        fn: countDocuments,
        signature: countDocumentsSignature,
    },
    createIndex: {
        fn: createIndex,
        signature: createIndexSignature,
    },
    createIndexes: {
        fn: createIndexes,
        signature: createIndexesSignature,
    },
    deleteMany: {
        fn: deleteMany,
        signature: deleteManySignature,
    },
    deleteOne: {
        fn: deleteOne,
        signature: deleteOneSignature,
    },
    distinct: {
        fn: distinct,
        signature: distinctSignature,
    },
    dropIndex: {
        fn: dropIndex,
        signature: dropIndexSignature,
    },
    dropIndexes: {
        fn: dropIndexes,
        signature: dropIndexesSignature,
    },
    find: {
        fn: find,
        signature: findSignature,
    },
    findOne: {
        fn: findOne,
        signature: findOneSignature,
    },
    findOneAndDelete: {
        fn: findOneAndDelete,
        signature: findOneAndDeleteSignature,
    },
    findOneAndReplace: {
        fn: findOneAndReplace,
        signature: findOneAndReplaceSignature,
    },
    findOneAndUpdate: {
        fn: findOneAndUpdate,
        signature: findOneAndUpdateSignature,
    },
    insertMany: {
        fn: insertMany,
        signature: insertManySignature,
    },
    insertOne: {
        fn: insertOne,
        signature: insertOneSignature,
    },
    mapReduce: {
        fn: mapReduce,
        signature: mapReduceSignature,
    },
    replaceOne: {
        fn: replaceOne,
        signature: replaceOneSignature,
    },
    updateMany: {
        fn: updateMany,
        signature: updateManySignature,
    },
    updateOne: {
        fn: updateOne,
        signature: updateOneSignature,
    },
};

export function list(): MethodDescription[] {
    return Object.keys(METHODS).map(name => {
        return {
            name,
            signature: METHODS[name].signature,
        };
    });
}

export function resolve(name: string): Method | undefined {
    const method = METHODS[name];

    if (method) {
        return method.fn;
    }

    return undefined;
}
