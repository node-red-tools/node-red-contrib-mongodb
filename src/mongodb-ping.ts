import { Node, NodeId, NodeProperties, Red } from 'node-red';
import { open } from './core';
import { ConfigNode } from './mongodb-config';

export interface PingNode extends Node {
    config: NodeId;
    propertyType: string;
    property: string;
}

interface Properties extends NodeProperties {
    config: NodeId;
    propertyType: string;
    property: string;
}

function setValue(
    RED: Red,
    msg: any,
    node: any,
    propertyType: string,
    property: string,
    value: any,
): void {
    if (propertyType === 'msg') {
        RED.util.setMessageProperty(msg, property, value);
    } else if (propertyType === 'flow' || propertyType === 'global') {
        const contextKey = RED.util.parseContextStore(property);
        const target = node.context()[propertyType];

        target.set(contextKey.key, value, contextKey.store);
    } else {
        throw new Error(`Invalid property type: ${propertyType}`);
    }
}

module.exports = function register(RED: Red): void {
    RED.nodes.registerType('mongodb-ping', function mongodbPing(
        this: PingNode,
        props: Properties,
    ): void {
        RED.nodes.createNode(this, props);

        this.name = props.name;
        this.config = props.config;
        this.propertyType = props.propertyType;
        this.property = props.property;

        const config = RED.nodes.getNode(this.config) as ConfigNode;

        this.on('input', async (msg: any, send: Function, done: Function) => {
            let result: string | null = null;

            try {
                if (!config || !config.settings) {
                    throw new Error('Node is not configured');
                }

                const conn = await open(config.settings);

                if (!conn.isConnected()) {
                    result = 'Connection is lost.';
                }
            } catch (e) {
                result = e.message;
            } finally {
                setValue(
                    RED,
                    msg,
                    this,
                    this.propertyType,
                    this.property,
                    result,
                );
                send(msg);
                done();
            }
        });
    });
};
