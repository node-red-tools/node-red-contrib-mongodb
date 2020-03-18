import { Request, Response } from 'express';
import { Node, NodeProperties, Red } from 'node-red';
import { Collection, ConnectionSettings, close } from './core';

export interface ConfigNode extends Node {
    settings: ConnectionSettings;
}

interface Properties extends NodeProperties, ConnectionSettings {}

// function deserializeCollection(input: any): any {
//     if (!input) {
//         return undefined;
//     }

//     if (typeof input === 'object') {
//         return input;
//     }

//     return JSON.parse(input);
// }

module.exports = function register(RED: Red): void {
    RED.nodes.registerType('mongodb-config', function mongodbConfig(
        this: ConfigNode,
        props: Properties,
    ): void {
        RED.nodes.createNode(this, props);

        this.settings = Object.freeze({
            host: props.host,
            port: props.port,
            database: props.database,
            username: props.username,
            password: props.password,
            collections: props.collections || [],
        });

        this.on('close', (done: Function) => {
            close(this.settings).finally(() => done());
        });
    });

    if (RED.httpAdmin != null) {
        RED.httpAdmin.get(
            '/mongodb/collection/methods',
            (_: Request, res: Response) => {
                return res.json(Collection.methods());
            },
        );

        RED.httpAdmin.get(
            '/mongodb/collections/${config}',
            (_: Request, res: Response) => {
                return res.json(Collection.methods());
            },
        );
    }
};
