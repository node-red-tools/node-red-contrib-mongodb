import { Node, NodeId, NodeProperties, Red } from 'node-red';
import { open } from './core';
import { ConfigNode } from './mongodb-config';

export interface CollectionNode extends Node {
    errorOutput: boolean;
    config: NodeId;
    collection: string;
    method: string;
    prop: string;
    propType: string;
}

interface Properties extends NodeProperties {
    outputs: number;
    config: NodeId;
    collection: string;
    method: string;
    prop: string;
    propType: string;
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
        this.prop = props.prop;
        this.propType = props.propType;

        const config = RED.nodes.getNode(this.config) as ConfigNode;

        this.on('input', async (msg: any, send: Function, done: Function) => {
            const sendToOutputs = (err?: Error, msg?: any) => {
                // if error occured
                if (err) {
                    // if we need to send it to a dedicated output
                    if (this.errorOutput) {
                        msg.error = err;

                        send([undefined, err]);
                    } else {
                        // otherwise just throw it
                        throw err;
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
                const args = RED.util.evaluateNodeProperty(
                    this.prop,
                    this.propType,
                    this,
                    msg,
                );

                msg.payload = await collection.execute(methodName, args);

                sendToOutputs(undefined, msg);
            } catch (e) {
                this.error('Failed to handle a message', e);
                sendToOutputs(e, msg);
            } finally {
                done();
            }
        });
    });
};
