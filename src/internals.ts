const OBJECT_ID_FIELDS = '___mongodb_objectid___';

export function setObjectIdFields(msg: any, paths: string[]): void {
    msg[OBJECT_ID_FIELDS] = paths;
}

export function getObjectIdFields(msg: any, remove: boolean = true): string[] {
    const fields = msg[OBJECT_ID_FIELDS];

    if (remove) {
        delete msg[OBJECT_ID_FIELDS];
    }

    if (Array.isArray(fields)) {
        return fields;
    }

    return [];
}
