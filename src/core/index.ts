import { Connection } from './connection';
import { ConnectionSettings, toURI } from './settings';

export * from './settings';
export * from './connection';
export * from './collection/index';

const POOL = {} as {
    [uri: string]: Promise<Connection>;
};

export async function open(settings: ConnectionSettings): Promise<Connection> {
    const uri = toURI(settings);
    let promise = POOL[uri];

    if (!promise) {
        promise = Connection.open(uri, settings.collections);

        POOL[uri] = promise;
    }

    try {
        const conn = await promise;

        return conn;
    } catch (e) {
        delete POOL[uri];

        throw e;
    }
}

export async function close(settings: ConnectionSettings): Promise<void> {
    const uri = toURI(settings);
    const conn = POOL[uri];

    if (!conn) {
        return Promise.resolve();
    }

    delete POOL[uri];

    (await conn).close();
}

export async function closeAll(): Promise<void> {
    // clean up POOL object in sync mode to avoid any race conditions
    const promises = Object.keys(POOL).map(key => {
        const promise = POOL[key];

        delete POOL[key];

        return promise;
    });

    if (promises.length === 0) {
        return Promise.resolve();
    }

    // close connections
    await Promise.all(
        promises.map(async (promise: Promise<Connection>) => {
            const conn = await promise;

            await conn.close();
        }),
    );
}
