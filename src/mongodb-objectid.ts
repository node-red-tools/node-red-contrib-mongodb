import { Node, NodeProperties, Red } from 'node-red';
import { setObjectIdFields } from './internals';

interface ObjectIdPath {
    type: string;
    value: string;
}

export interface ObjectIdNode extends Node {
    method: string;
    paths: string[];
}

interface Properties extends NodeProperties {
    method: string;
    paths: ObjectIdPath[];
}

module.exports = function register(RED: Red): void {
    RED.nodes.registerType('mongodb-objectid', function mongodbObjectId(
        this: ObjectIdNode,
        props: Properties,
    ): void {
        RED.nodes.createNode(this, props);

        this.name = props.name;
        this.method = props.method;
        this.paths = props.paths.map(i => `${i.type}.${i.value}`);

        this.on('input', async (msg: any, send: Function, done: Function) => {
            setObjectIdFields(msg, this.paths);
            send(msg);
            done();
        });
    });
};
