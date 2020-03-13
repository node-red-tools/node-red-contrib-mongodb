import { CollectionCreateOptions, DbCollectionOptions } from 'mongodb';
import { Node, NodeId, NodeProperties, Red } from 'node-red';
import { open } from './connection';
import { resolve } from './methods/collection';
import { ConfigNode } from './mongodb-config';

interface Collection {
    name: string;
    options?: DbCollectionOptions;
    autoCreate?: boolean;
    autoCreateOptions?: CollectionCreateOptions;
}

export interface CollectionNode extends Node {
    config: NodeId;
    collection: Collection;
    method: string;
    prop: string;
}

interface Properties extends NodeProperties {
    config: NodeId;
    collection: string;
    options?: DbCollectionOptions;
    autoCreate?: boolean;
    autoCreateOptions?: CollectionCreateOptions;
}

module.exports = function register(RED: Red): void {
    RED.nodes.registerType('mongodb-collection', function mongodbCollection(
        this: CollectionNode,
        props: Properties,
    ): void {
        RED.nodes.createNode(this, props);

        this.config = props.config;
        this.collection = {
            name: props.collection,
            options: props.options,
            autoCreate: props.autoCreate,
            autoCreateOptions: props.autoCreateOptions,
        };

        const config = RED.nodes.getNode(this.config) as ConfigNode;

        this.on('input', async (msg: any, send: Function, done: Function) => {
            try {
                if (!config || !config.settings) {
                    throw new Error('Node is not configured');
                }

                const msgMongo = msg.mongodb || {};
                const collectionName =
                    msgMongo.collection || this.collection.name;
                const collectionOpts =
                    msgMongo.options || this.collection.options;
                const methodName = msgMongo.method || this.method;

                if (!methodName) {
                    throw new Error(
                        `Method name is not provided for "${collectionName}" collection`,
                    );
                }

                const method = resolve(methodName);

                if (!method) {
                    throw new Error(
                        `Invalid method name of "${collectionName}" collection: ${methodName}`,
                    );
                }

                const db = await open(config.settings);
                let collection = db.collection(collectionName, collectionOpts);

                if (!collection) {
                    const autoCreate =
                        typeof msgMongo.autoCreate === 'boolean'
                            ? msgMongo.autoCreate
                            : this.collection.name;

                    if (!autoCreate) {
                        throw new Error(
                            `Collection does not exist: ${collectionName}`,
                        );
                    }

                    const autoCreateOptions =
                        msgMongo.autoCreateOptions ||
                        this.collection.autoCreateOptions;

                    collection = await db.createCollection(
                        collectionName,
                        autoCreateOptions as CollectionCreateOptions,
                    );
                }

                const args = msg[this.prop || 'payload'];

                msg.payload = await method(collection, args);

                send(msg);
            } catch (e) {
                msg.error = e;

                send(msg);

                this.error(e.toString());
            } finally {
                done();
            }
        });
    });
};
