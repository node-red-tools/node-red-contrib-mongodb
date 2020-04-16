import { MongoClientOptions } from 'mongodb';
import { CollectionSettings } from './collection';

const SCHEMAS = [
    'mongodb://',
    'mongodb+srv://'
];

export interface ConnectionSettings {
    host: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    options?: MongoClientOptions;
    collections: CollectionSettings[];
}

function normalizeHost(host: string): { schema: string, url: string } {
    let normalized = host;

    const schema = SCHEMAS.find(i => host.startsWith(i));

    if (schema) {
        normalized = host.substr(schema.length);
    }

    if (host.endsWith('/')) {
        normalized = host.substring(0, host.length - 1);
    }

    return { url: normalized, schema: schema || SCHEMAS[0] };
}

export function toURI(settings: ConnectionSettings): string {
    const host = normalizeHost(settings.host);
    let fullUrl = host.url;

    if (settings.username && settings.password) {
        fullUrl = `${settings.username}:${settings.password}@${host.url}`;
    }

    if (settings.port) {
        fullUrl = `${fullUrl}:${settings.port}`;
    }

    if (settings.database) {
        fullUrl = `${fullUrl}/${settings.database}`;
    }

    return `${host.schema}${fullUrl}`;
}
