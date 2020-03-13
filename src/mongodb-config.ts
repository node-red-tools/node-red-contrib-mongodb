import { Request, Response } from 'express';
import { Node, NodeProperties, Red } from 'node-red';
import { Settings, close } from './connection';
import { list } from './methods/collection';

export interface ConfigNode extends Node {
    settings: Settings;
}

interface Properties extends NodeProperties, Settings {}

module.exports = function register(RED: Red): void {
    RED.nodes.registerType('mongodb-config', function mongodbConfig(
        this: ConfigNode,
        props: Properties,
    ): void {
        RED.nodes.createNode(this, props);

        this.settings = Object.freeze({
            url: props.url,
            database: props.database,
            username: props.username,
            password: props.password,
        });

        this.on('close', (done: Function) => {
            close(this.settings).finally(() => done());
        });
    });

    if (RED.httpAdmin != null) {
        RED.httpAdmin.get(
            '/mongodb/collection/methods',
            (_: Request, res: Response) => {
                return res.json(list());
            },
        );
    }
};
