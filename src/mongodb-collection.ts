import { Node, NodeId, NodeProperties, Red } from 'node-red';
import { open, toObjectId } from './core';
import { getObjectIdFields } from './internals';
import { ConfigNode } from './mongodb-config';

interface MethodArgument {
    type: string;
    value: string;
}

export interface CollectionNode extends Node {
    errorOutput: boolean;
    config: NodeId;
    collection: string;
    method: string;
    methodSignature: { [argName: string]: MethodArgument };
}

interface Properties extends NodeProperties {
    outputs: number;
    config: NodeId;
    collection: string;
    method: string;
    methodSignature: { [argName: string]: MethodArgument };
}

module.exports = function register(RED: Red): void {
    RED.nodes.registerType('mongodb-collection', function mongodbCollection(
        this: CollectionNode,
        props: Properties,
    ): void {
        RED.nodes.createNode(this, props);

        this.errorOutput = props.outputs > 1;
        this.config = props.config;
        this.collection = props.collection;
        this.method = props.method;
        this.methodSignature = props.methodSignature;

        const config = RED.nodes.getNode(this.config) as ConfigNode;

        this.on('input', async (msg: any, send: Function, done: Function) => {
            const sendToOutputs = (msg: any, err?: Error) => {
                // if error occured
                if (err) {
                    // if we need to send it to a dedicated output
                    if (this.errorOutput) {
                        msg.error = err;

                        send([undefined, msg]);
                    } else {
                        this.error(err, msg);
                    }

                    return;
                }

                if (this.errorOutput) {
                    send([msg, undefined]);
                } else {
                    send(msg);
                }
            };

            try {
                if (!config || !config.settings) {
                    throw new Error('Node is not configured');
                }

                const collectionName = msg.collection || this.collection;
                const methodName = msg.method || this.method;

                if (!methodName) {
                    throw new Error(
                        `Method name is not provided for "${collectionName}" collection`,
                    );
                }

                const conn = await open(config.settings);
                const collection = conn.collection(collectionName);
                const args: { [name: string]: any } = {};

                // Resolve argument fields from the msg object
                Object.keys(this.methodSignature).forEach(argName => {
                    const arg = this.methodSignature[argName];

                    args[argName] = RED.util.evaluateNodeProperty(
                        arg.value,
                        arg.type,
                        this,
                        msg,
                    );
                });

                const objectIdFields = getObjectIdFields(msg);

                // Convert string fields to MongoDB ObjectId fields
                if (objectIdFields.length > 0) {
                    toObjectId(args, objectIdFields);
                }

                msg.payload = await collection.execute(methodName, args);

                sendToOutputs(msg);
            } catch (e) {
                sendToOutputs(msg, e);
            } finally {
                done();
            }
        });
    });
};
