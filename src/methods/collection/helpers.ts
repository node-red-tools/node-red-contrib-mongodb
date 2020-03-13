import { ObjectId } from 'mongodb';

export function normalizeDocument(
    doc?: any & { _id: ObjectId },
): any & { _id: string } {
    if (!doc) {
        return null;
    }

    if (doc._id) {
        doc._id = doc._id.toString();
    }

    return doc;
}
