import { Db, MongoClient } from 'mongodb';

const SCHEMA = 'mongodb://';
type Connection = Promise<MongoClient>;
const POOL = {} as {
    [url: string]: Connection;
};

export interface Settings {
    url: string;
    database: string;
    username?: string;
    password?: string;
}

function normalizeUrl(url: string): string {
    let normalized = url;

    if (url.startsWith(SCHEMA)) {
        normalized = url.substr(SCHEMA.length);
    }

    if (url.endsWith('/')) {
        normalized = url.substring(0, url.length - 1);
    }

    return normalized;
}

function conntectionString(settings: Settings): string {
    let fullUrl = normalizeUrl(settings.url);

    if (settings.username && settings.password) {
        fullUrl = `${settings.username}:${settings.password}@${fullUrl}`;
    }

    return `${SCHEMA}${fullUrl}`;
}

export async function open(settings: Settings): Promise<Db> {
    const uri = conntectionString(settings);
    let conn = POOL[uri];

    if (!conn) {
        conn = MongoClient.connect(uri);

        POOL[uri] = conn;
    }

    const client = await conn;

    return client.db(settings.database);
}

export async function close(settings: Settings): Promise<void> {
    const uri = conntectionString(settings);
    const conn = POOL[uri];

    if (!conn) {
        return Promise.resolve();
    }

    delete POOL[uri];

    (await conn).close();
}

export async function closeAll(): Promise<void> {
    // clean up POOL object in sync mode to avoid any race conditions
    const connections = Object.keys(POOL).map(key => {
        const conn = POOL[key];

        delete POOL[key];

        return conn;
    });

    if (connections.length === 0) {
        return Promise.resolve();
    }

    // close connections
    await Promise.all(
        connections.map(async (conn: Connection) => {
            const client = await conn;

            await client.close();
        }),
    );
}
