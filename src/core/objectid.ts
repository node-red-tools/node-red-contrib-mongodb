import get from 'lodash.get';
import set from 'lodash.set';
import { ObjectId } from 'mongodb';

export function toObjectId(input: Object, paths: string[]): void {
    paths.map((path: string) => {
        const idStr = get(input, path);

        if (idStr && ObjectId.isValid(idStr)) {
            set(input, path, new ObjectId(idStr));
        }
    });
}
