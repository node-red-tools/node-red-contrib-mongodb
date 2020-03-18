import { Request, Response } from 'express';
import { Node, NodeProperties, Red } from 'node-red';
import { Collection, ConnectionSettings, close } from './core';

export interface ConfigNode extends Node {
    settings: ConnectionSettings;
}

type CollectionConfigOptionType =
    | 'flow'
    | 'global'
    | 'json'
    | 'jsonata'
    | 'env';

interface CollectionConfig {
    name: string;
    optionsType: CollectionConfigOptionType;
    options: string;
    autoCreate: boolean;
    autoCreateOptionsType: CollectionConfigOptionType;
    autoCreateOptions: string;
}

interface Properties extends NodeProperties {
    host: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    options?: string;
    collections: CollectionConfig[];
}

module.exports = function register(RED: Red): void {
    RED.nodes.registerType(
        'mongodb-config',
        function mongodbConfig(this: ConfigNode, props: Properties): void {
            RED.nodes.createNode(this, props);

            this.settings = Object.freeze({
                host: props.host,
                port: props.port,
                database: props.database,
                username: props.username,
                password: props.password,
                collections: (props.collections || []).map(config => {
                    return {
                        name: config.name,
                        autoCreate: config.autoCreate,
                        options: RED.util.evaluateNodeProperty(
                            config.options,
                            config.optionsType,
                            this,
                            {},
                        ),
                        autoCreateOptions: RED.util.evaluateNodeProperty(
                            config.autoCreateOptions,
                            config.autoCreateOptionsType,
                            this,
                            {},
                        ),
                    };
                }),
                options: RED.util.evaluateJSONataExpression(
                    RED.util.prepareJSONataExpression(
                        props.options || '{}',
                        this,
                    ),
                    {},
                ),
            });

            this.on('close', (done: Function) => {
                close(this.settings).finally(() => done());
            });
        },
        {
            credentials: {
                username: { type: 'text' },
                password: { type: 'password' },
            },
        },
    );

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
