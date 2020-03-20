import { Request, Response } from 'express';
import { Node, NodeProperties, Red } from 'node-red';
import {
    Collection,
    CollectionSettings,
    ConnectionSettings,
    close,
} from './core';

export interface ConfigNode extends Node {
    settings: ConnectionSettings;
    credentials: {
        username?: string;
        password?: string;
    };
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
    autoCreateIndexesType: CollectionConfigOptionType;
    autoCreateIndexes: string;
}

interface Properties extends NodeProperties {
    host: string;
    port?: number;
    database: string;
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
                username: this.credentials.username,
                password: this.credentials.password,
                collections: (props.collections || []).map(config => {
                    const deserizliedIndexes = RED.util.evaluateNodeProperty(
                        config.autoCreateIndexes,
                        config.autoCreateIndexesType,
                        this,
                        {},
                    );

                    let indexes;

                    if (Array.isArray(deserizliedIndexes)) {
                        indexes = deserizliedIndexes;
                    } else if (typeof deserizliedIndexes === 'object') {
                        indexes = [deserizliedIndexes];
                    }

                    return {
                        name: config.name,
                        options: RED.util.evaluateNodeProperty(
                            config.options,
                            config.optionsType,
                            this,
                            {},
                        ),
                        autoCreate: config.autoCreate,
                        autoCreateOptions: RED.util.evaluateNodeProperty(
                            config.autoCreateOptions,
                            config.autoCreateOptionsType,
                            this,
                            {},
                        ),
                        autoCreateIndexes: indexes,
                    } as CollectionSettings;
                }),
                options: RED.util.evaluateNodeProperty(
                    props.options || '{}',
                    'json',
                    this,
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
