import { CollectionSettings } from './collection';

const SCHEMA = 'mongodb://';

export interface ConnectionSettings {
    host: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    collections: CollectionSettings[];
}

function normalizeHost(host: string): string {
    let normalized = host;

    if (host.startsWith(SCHEMA)) {
        normalized = host.substr(SCHEMA.length);
    }

    if (host.endsWith('/')) {
        normalized = host.substring(0, host.length - 1);
    }

    return normalized;
}

export function toURI(settings: ConnectionSettings): string {
    let fullUrl = normalizeHost(settings.host);

    if (settings.username && settings.password) {
        fullUrl = `${settings.username}:${settings.password}@${fullUrl}`;
    }

    if (settings.port) {
        fullUrl = `${fullUrl}:${settings.port}`;
    }

    return `${SCHEMA}${fullUrl}`;
}
